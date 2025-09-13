interface Feedback {
    id: string;
    interviewId: string;
    totalScore: number;
    categoryScores: Array<{
        name: string;
        score: number;
        comment: string;
    }>;
    strengths: string[];
    areasForImprovement: string[];
    finalAssessment: string;
    generatedFeedback: finalAssessment,
    createdAt: string | Date | FirebaseFirestore.Timestamp;
}

interface Interview {
    id: string;
    role: string;
    level: string;
    questions: string[];
    techstack: string[];
    createdAt: string | Date | FirebaseFirestore.Timestamp;
    userId: string;
    type: string;
    finalized: boolean;
}

interface CreateFeedbackParams {
    interviewId: string;
    userId: string;
    transcript: { role: string; content: string }[];
    feedbackId?: string;
}

interface User {
    name: string;
    email: string;
    id: string;
}

interface InterviewCardProps {
    id?: string;
    userId?: string;
    role: string;
    type: string;
    techstack: string[];
    createdAt?: string | FirebaseFirestore.Timestamp;
}

interface AgentProps {
    userName: string;
    userId?: string;
    interviewId?: string;
    feedbackId?: string;
    type: "generate" | "interview";
    questions?: string[];
}

interface RouteParams {
    params: Record<string, string>;
    searchParams: Record<string, string>;
}

interface GetFeedbackByInterviewIdParams {
    interviewId: string;
    userId: string;
}

interface GetLatestInterviewsParams {
    userId: string;
    limit?: number;
}

interface SignInParams {
    email: string;
    idToken: string;
}

interface SignUpParams {
    uid: string;
    name: string;
    email: string;
    password: string;
}

type FormType = "sign-in" | "sign-up";

interface InterviewFormProps {
    interviewId: string;
    role: string;
    level: string;
    type: string;
    techstack: string[];
    amount: number;
}

interface TechIconProps {
    techStack: string[];
}
// 🔹 Vapi message type
interface Message {
    type: "transcript" | string;
    role: "user" | "assistant" | "system";
    transcriptType?: "final" | "partial";
    transcript?: string;
    [key: string]: any;
}
