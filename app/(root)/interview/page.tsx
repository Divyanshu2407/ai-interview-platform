import Agent from "@/Components/Agent";
import { getCurrentUser } from "@/lib/actions/auth.action";
import { db } from "@/Firebase/admin";
import admin from "firebase-admin";

const Page = async () => {
    const user = await getCurrentUser();
    if (!user) {
        return <p>Please sign in to start an interview.</p>;
    }

    const interviewRef = db.collection("interviews").doc(); // server generates id
    await interviewRef.set({
        role: "Practice Interview",
        level: "not specified",
        type: "generated",
        techstack: [],
        questions: [],
        userId: user.id,
        finalized: false,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    const interviewId = interviewRef.id;

    return (
        <>
            <h3> Interview Session :) </h3>
            <Agent
                userName={user?.name}
                userId={user?.id}
                interviewId={interviewId}
                type="generate"
            />
        </>
    );
};

export default Page;
