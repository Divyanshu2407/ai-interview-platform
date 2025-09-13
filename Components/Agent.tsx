"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import { vapi } from "@/lib/vapi.sdk";
import { createFeedback } from "@/lib/actions/general.action";

enum CallStatus {
    INACTIVE = "INACTIVE",
    CONNECTING = "CONNECTING",
    ACTIVE = "ACTIVE",
    FINISHED = "FINISHED",
}

interface SavedMessage {
    role: "user" | "assistant";
    content: string;
}

interface AgentProps {
    userName: string;
    userId: string;
    interviewId: string;
    questions?: string[];
}

const Agent = ({ userName, userId, interviewId, questions }: AgentProps) => {
    const router = useRouter();
    const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
    const [messages, setMessages] = useState<SavedMessage[]>([]);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isGeneratingFeedback, setIsGeneratingFeedback] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const feedbackGeneratedRef = useRef(false);

    // Listen to VAPI events
    useEffect(() => {
        const handleCallStart = () => setCallStatus(CallStatus.ACTIVE);
        const handleCallEnd = () => setTimeout(() => setCallStatus(CallStatus.FINISHED), 500);

        const handleMessage = (message: any) => {
            if (message.type === "transcript" && message.transcriptType === "final") {
                const newMessage: SavedMessage = {
                    role: message.role as "user" | "assistant",
                    content: message.transcript || "",
                };
                setMessages((prev) => [...prev, newMessage]);
            }
        };

        const handleSpeechStart = () => setIsSpeaking(true);
        const handleSpeechEnd = () => setIsSpeaking(false);
        const handleError = (err: any) => console.log("VAPI error:", err);

        vapi.on("call-start", handleCallStart);
        vapi.on("call-end", handleCallEnd);
        vapi.on("message", handleMessage);
        vapi.on("speech-start", handleSpeechStart);
        vapi.on("speech-end", handleSpeechEnd);
        vapi.on("error", handleError);

        return () => {
            vapi.off("call-start", handleCallStart);
            vapi.off("call-end", handleCallEnd);
            vapi.off("message", handleMessage);
            vapi.off("speech-start", handleSpeechStart);
            vapi.off("speech-end", handleSpeechEnd);
            vapi.off("error", handleError);
        };
    }, []);

    // Update last message (kept in UI via map) — no separate lastMessage state required
    useEffect(() => {
        // nothing else required here; messages are used directly in transcript rendering
    }, [messages]);

    // feedback generation function (top-level so other handlers can call it)
    const generateFeedback = async () => {
        if (!interviewId || !userId) {
            console.error("❌ Missing interviewId or userId:", { interviewId, userId });
            setError("Something went wrong: Missing interview or user information.");
            return;
        }

        if (feedbackGeneratedRef.current) {
            // already generated
            return;
        }

        feedbackGeneratedRef.current = true;
        setIsGeneratingFeedback(true);

        // tiny delay to ensure last transcripts arrived
        await new Promise((res) => setTimeout(res, 500));

        const { success, feedbackId } = await createFeedback({
            interviewId,
            userId,
            transcript: messages,
        });

        console.log("Feedback generation result:", { success, feedbackId });

        if (success && feedbackId) {
            router.push(`/interview/${interviewId}/feedback`);
        } else {
            setError("Error saving feedback. Please try again.");
        }

        setIsGeneratingFeedback(false);
    };

    // Auto-generate when call ends + messages exist
    useEffect(() => {
        if (callStatus === CallStatus.FINISHED && messages.length > 0 && !feedbackGeneratedRef.current) {
            generateFeedback();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [callStatus, messages]);

    const handleCall = async () => {
        setCallStatus(CallStatus.CONNECTING);
        await vapi.start(process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID!, {
            variableValues: {
                username: userName,
                userid: userId,
                questions: questions?.length ? JSON.stringify(questions) : undefined,
            },
        });
    };

    const handleDisconnect = async () => {
        setCallStatus(CallStatus.FINISHED);
        vapi.stop();

        // Generate feedback immediately if user clicks Finish Interview
        if (!feedbackGeneratedRef.current && messages.length > 0) {
            await generateFeedback();
        }
    };

    const handleRestart = async () => {
        vapi.stop();
        setMessages([]);
        setCallStatus(CallStatus.INACTIVE);
        feedbackGeneratedRef.current = false;
        await handleCall();
    };

    if (isGeneratingFeedback) {
        return (
            <div className="w-full flex flex-col items-center justify-center mt-10">
                <p className="text-lg font-semibold text-gray-700 animate-pulse">
                    Generating feedback, please wait...
                </p>
            </div>
        );
    }

    return (
        <>
            {error && <div className="w-full text-center text-red-600 font-semibold my-2">{error}</div>}

            <div className="call-view">
                {/* AI Interviewer Card */}
                <div className="card-interviewer bg-gradient-to-r from-purple-200 to-pink-400">
                    <div className="p-1 rounded-full bg-black/40">
                        <div className="avatar">
                            <div className="p-2 rounded-full bg-gradient-to-r from-purple-300 to-pink-500">
                                <Image src="/ai-avatar.png" alt="vapi" width={65} height={54} className="object-cover rounded-full" />
                            </div>
                            {isSpeaking && <span className="animate-speak ease-in-out infinite bg-black/50 rounded-full inline-block w-30 h-30" />}
                        </div>
                    </div>
                    <h3 className="text-black font-bold text-2xl">AI Interviewer</h3>
                </div>

                {/* User Card */}
                <div className="card-border">
                    <div className="card-content bg-gradient-to-r from-purple-200 to-pink-400">
                        <div className="p-1 rounded-full bg-black/40">
                            <div className="p-2 rounded-full bg-gradient-to-r from-purple-200 to-pink-400">
                                <Image src="/user-avatar.jpg" alt="user avatar" width={540} height={540} className="rounded-full object-cover size-[120px]" />
                            </div>
                        </div>
                        <h3 className="text-black font-bold text-2xl">{userName}</h3>
                    </div>
                </div>
            </div>

            {/* ########## Transcript (map all messages; last one gets fade-in animation) */}
            {messages.length > 0 && (
                <div className="transcript-border max-h-34 overflow-y-auto">
                    <div className="transcript flex flex-col space-y-2">
                        {messages.map((msg, index) => (
                            <p
                                key={index}
                                className={cn(
                                    "transition-opacity duration-500 opacity-0",
                                    "animate-fadeIn opacity-90",
                                    msg.role === "assistant" ? "text-pink-400" : "text-pink-700"
                                )}
                            >
                                <strong> { msg.role === "assistant" ? "AI Interview: " : "You: "} </strong>
                                {msg.content}
                            </p>
                        ))}
                    </div>
                </div>
            )}


            <div className="w-full flex justify-center gap-4">
                {callStatus !== CallStatus.ACTIVE ? (
                    <button className="relative btn-call bg-green-500 hover:bg-green-600 text-black font-bold rounded-full shadow-md transition-all duration-500 ease-in-out hover:scale-105 hover:shadow-lg" onClick={handleCall}>
                        <span className={cn("absolute animate-ping rounded-full opacity-75", callStatus !== CallStatus.CONNECTING && "hidden")} />
                        <span>{callStatus === CallStatus.INACTIVE || callStatus === CallStatus.FINISHED ? "Start an Interview" : "Calling.."}</span>
                    </button>
                ) : (
                    <button className="btn-disconnect bg-red-500 hover:bg-red-700 text-black font-bold rounded-full shadow-md transition-all duration-500 ease-out hover:scale-105 hover:shadow-lg" onClick={handleDisconnect}>
                        Finish Interview
                    </button>
                )}

                {(callStatus === CallStatus.FINISHED || callStatus === CallStatus.ACTIVE) && (
                    <button className="btn-disconnect text-black bg-gradient-to-r from-purple-200 to-pink-400 font-bold rounded-full shadow-md transition-all duration-500 ease-out hover:scale-105 hover:shadow-lg" onClick={handleRestart}>
                        Restart an Interview
                    </button>
                )}
            </div>
        </>
    );
};

export default Agent;
