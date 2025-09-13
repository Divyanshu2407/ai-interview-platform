import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import { getRandomInterviewCover } from "@/lib/utils";
import { db } from "@/Firebase/admin";

interface GenerateInterviewRequest {
    type: string;
    role: string;
    level?: string;
    techstack?: string;
    amount: number;
    userid: string;
}

export async function GET() {
    return new Response(JSON.stringify({ success: true, data: "THANK YOU!" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
    });
}

export async function POST(request: Request) {
    try {
        const body: GenerateInterviewRequest = await request.json();
        const { type, role, level, techstack, amount, userid } = body;

        if (!role || !amount || !userid) {
            return new Response(
                JSON.stringify({ success: false, error: "Missing required fields: role, amount, or userid" }),
                { status: 400, headers: { "Content-Type": "application/json" } }
            );
        }

        const { text: questions } = await generateText({
            model: google("gemini-2.0-flash-exp"),
            prompt: `Prepare questions for a job interview.
                        The job role is ${role}.
                        The job experience level is ${level || "not specified"}.
                        The tech stack used in the job is: ${techstack || "not specified"}.
                        The focus between behavioural and technical questions should lean towards: ${type}.
                        The amount of questions required is: ${amount || "5"}.
                        Please return only the questions as a JSON array: ["Question 1", "Question 2"].
                        Do not include any extra text or special characters.`,
        });

        let parsedQuestions: string[];
        try {
            parsedQuestions = JSON.parse(questions);
            if (!Array.isArray(parsedQuestions)) {
                throw new Error("Questions must be returned as an array");
            }
        } catch {
            console.error("Failed to parse questions:", questions);
            return new Response(
                JSON.stringify({ success: false, error: "Invalid question format from model" }),
                { status: 500, headers: { "Content-Type": "application/json" } }
            );
        }

        const interview = {
            role,
            type,
            level,
            techstack: typeof techstack === "string" ? techstack.split(",").map((t) => t.trim()) : [],
            questions: parsedQuestions,
            userId: userid,
            finalized: true,
            coverImage: getRandomInterviewCover(),
            createdAt: new Date().toISOString(),
        };

        const interviewRef = await db.collection("interviews").add(interview);

        return new Response(
            JSON.stringify({
                success: true,
                interviewId: interviewRef.id,
                questions: parsedQuestions,
            }),
            { status: 200, headers: { "Content-Type": "application/json" } }
        );
    } catch (error: any) {
        console.error("Error generating interview:", error);
        return new Response(
            JSON.stringify({ success: false, error: error?.message || "Internal server error" }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
}
