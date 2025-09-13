"use server";

import { generateObject } from "ai";
import { google } from "@ai-sdk/google";
import { db } from "@/Firebase/admin";
import { feedbackSchema } from "@/constants";
import admin from "firebase-admin";

// helper to safely serialize Firestore timestamps
const serializeDoc = (doc: FirebaseFirestore.DocumentSnapshot) => {
    const data = (doc.data() || {}) as any;
    return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data.createdAt ?? null,
        updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate().toISOString() : data.updatedAt ?? null,
    };
};

//Create structured interview feedback and save it to Firestore.
export async function createFeedback({
                                         interviewId,
                                         userId,
                                         transcript,
                                     }: Omit<CreateFeedbackParams, "feedbackId">) {
    try {
        if (!interviewId || !userId) {
            console.error("createFeedback called without interviewId or userId", { interviewId, userId });
            return { success: false, error: "Missing interviewId or userId" };
        }
        if (!transcript || transcript.length === 0) {
            console.warn("No transcript provided, skipping feedback generation.");
            return { success: false, error: "Transcript is empty" };
        }

        const formattedTranscript = transcript
            .map((s: { role: string; content: string }) => `- ${s.role}: ${s.content}\n`)
            .join("");
        console.log("Sending transcript to Gemini (trimmed):", formattedTranscript.slice(0, 800));

        const {
            object: {
                totalScore,
                categoryScores,
                strengths,
                areasForImprovement,
                finalAssessment,
            },
        } = await generateObject({
            model: google("gemini-2.0-flash-exp"),
            schema: feedbackSchema,
            prompt: `You are an AI interviewer analyzing a mock interview...
            Transcript: ${formattedTranscript}`,
            system: "You are a professional interviewer analyzing a mock interview.",
        });

        const feedbackRef = db.collection("feedback").doc();

        await feedbackRef.set({
            interviewId,
            userId,
            totalScore,
            categoryScores,
            strengths,
            areasForImprovement,
            finalAssessment,
            generatedFeedback: finalAssessment,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });
        console.log("✅ Feedback saved in Firestore:", {
            feedbackId: feedbackRef.id,
            interviewId,
            userId,
        });
        return { success: true, feedbackId: feedbackRef.id };

    } catch (error: any) {
        console.error(" Error saving feedback:", error.message, error.stack);
        return {
            success: false,
            error: error.message || "Feedback generation failed. Please try again." };
    }
}

 // Fetch a single interview by its ID.
export async function getInterviewById(id: string): Promise<Interview | null> {
    const interview = await db.collection("interviews").doc(id).get();
    return interview.exists ? (serializeDoc(interview) as Interview) : null;
}


 //Fetch the latest feedback for a given interview + user.
export async function getFeedbackByInterviewId(
    params: GetFeedbackByInterviewIdParams
): Promise<Feedback | null> {
    const { interviewId, userId } = params;


    try {
        console.log("Querying feedback for interviewId:", interviewId, "userId:", userId);


        // primary query: filter by interviewId + userId + orderBy createdAt
        let querySnapshot = await db
        .collection("feedback")
        .where("interviewId", "==", interviewId)
        .where("userId", "==", userId)
        .orderBy("createdAt", "desc")
        .limit(1)
        .get();

        // fallback: sometimes createdAt serverTimestamp hasn't resolved;
        if (querySnapshot.empty) {
            console.warn("Primary feedback query returned empty — trying fallback query without orderBy");
            querySnapshot = await db
                .collection("feedback")
                .where("interviewId", "==", interviewId)
                .where("userId", "==", userId)
                .limit(1)
                .get();
        }
        if (querySnapshot.empty) {
            console.log("No feedback found");
            return null;
        }

        const feedbackDoc = querySnapshot.docs[0];
        return serializeDoc(feedbackDoc) as Feedback;
    } catch (err) {
        console.error("Error fetching feedback:", err);
        return null;
    }
}

// Fetch the latest finalized interviews from other users.
export async function getLatestInterviews(
    params: GetLatestInterviewsParams
): Promise<Interview[] | null> {
    const { userId, limit = 20 } = params;

    const interviews = await db
        .collection("interviews")
        .orderBy("createdAt", "desc")
        .where("finalized", "==", true)
        .where("userId", "!=", userId)
        .limit(limit)
        .get();

    return interviews.docs.map((doc) => serializeDoc(doc)) as Interview[]; // 🔧 serialize
}


 // Fetch all interviews for a given user.
export async function getInterviewsByUserId(
    userId: string
): Promise<Interview[] | null> {
    const interviews = await db
        .collection("interviews")
        .where("userId", "==", userId)
        .orderBy("createdAt", "desc")
        .get();

    return interviews.docs.map((doc) => serializeDoc(doc)) as Interview[]; // 🔧 serialize
}
