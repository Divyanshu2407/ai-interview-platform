import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const toolCalls = body?.toolCalls || [];

        const results: any[] = [];

        for (const toolCall of toolCalls) {
            if (toolCall.name === "generate_questions") {
                const input = {
                    ...toolCall.input,
                    userid: body?.conversation?.variables?.userid,
                };

                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_BASE_URL}/api/vapi/generate`,
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(input),
                    }
                );

                const data = await response.json();

                results.push({
                    toolCallId: toolCall.id,
                    result: {
                        interviewId: data.interviewId,
                        questions: data.questions,
                    },
                });
            }
        }
        return NextResponse.json({ results });
    } catch (error) {
        console.error("Webhook error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
