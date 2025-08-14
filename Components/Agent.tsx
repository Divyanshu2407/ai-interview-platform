'use client'

import React, {useEffect, useState} from 'react'
import Image from "next/image";
import {cn} from "@/lib/utils";
import {useRouter} from "next/navigation";
import {vapi} from "@/lib/vapi.sdk";

enum CallStatus {
    INACTIVE = "INACTIVE",
    CONNECTING = "CONNECTING",
    ACTIVE = "ACTIVE",
    FINISHED = "FINISHED",
}

interface SavedMessage {
    role: 'user' | 'system' | 'assistant';
    content: string;
}

const Agent = ({ userName, userId, type }: AgentProps ) => {
    const router = useRouter();

    const [ callStatus, setCallStatus ]  = useState<CallStatus>( CallStatus.INACTIVE );
    const [ messages, setMessages ]  = useState<Message[]>([]);
    const [ isSpeaking, setIsSpeaking ]  = useState(false);
    // const [lastMessage, setLastMessage] = useState<string>("");




    useEffect(() => {
        const onCallStart = () => {
            setCallStatus(CallStatus.ACTIVE);
        }
        const onCallEnd = () => {
            setCallStatus(CallStatus.FINISHED);
        }

        const onMessage = (message : Message) => {
            if(message.type === 'transcript' && message.transcriptType === 'final'){
                const newMessage = { role: message.role, content: message.transcript}

                setMessages((prev) => [...prev, newMessage]);
            }
        };

        const onSpeechStart = () => setIsSpeaking(true);
        const onSpeechEnd = () => setIsSpeaking(false);

        const onError = (error: Error) => console.log('Error', error);

        vapi.on('call-start', onCallStart);
        vapi.on('call-end', onCallEnd);
        vapi.on('message', onMessage);
        vapi.on('speech-start', onSpeechStart);
        vapi.on('speech-end', onSpeechEnd);
        vapi.on('error', onError);

        return() => {
            vapi.off('call-start', onCallStart);
            vapi.off('call-end', onCallEnd);
            vapi.off('message', onMessage);
            vapi.off('speech-start', onSpeechStart);
            vapi.off('speech-end', onSpeechEnd);
            vapi.off('error', onError);
        }

    }, [])

    useEffect(( ) => {
        if(callStatus === CallStatus.FINISHED) router.push('/');
    }, [messages, callStatus, type, userId]);

    const handleCall = async () => {
        setCallStatus(CallStatus.CONNECTING);

        await vapi.start(process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID!,  {
            variableValues: {
                username: userName,
                userid: userId,
            }
        })
    }

    const handleDisconnect = () => {
        setCallStatus(CallStatus.FINISHED);

        vapi.stop();
    }

    const latestMessage = messages[ messages.length - 1 ]?.content;

    const isCallInactiveOrFinished  = callStatus === CallStatus.INACTIVE || callStatus === CallStatus.FINISHED;

    return (
        <>
        <div className = "call-view">
           <div className = "card-interviewer bg-gradient-to-r from-purple-200 to-pink-400 ">
               <div className="p-1 rounded-full bg-black/40">
               <div className = "avatar">
                   <div className="p-2 rounded-full bg-gradient-to-r from-purple-300 to-pink-500 ">
                       <Image
                           src="/ai-avatar.png"
                           alt="vapi"
                           width={65}
                           height={54}
                           className="object-cover rounded-full"
                       />
                   </div>
                   {isSpeaking && <span className="animate-speak ease-in-out infinite bg-black/50 rounded-full inline-block w-30 h-30" />}
               </div>
               </div>
               <h3 className="text-black font-bold text-2xl"> AI Interviewer </h3>
           </div>

            <div className = "card-border">
                <div className = "card-content bg-gradient-to-r from-purple-200 to-pink-400">
                    <div className="p-1 rounded-full bg-black/40">
                       <div className="p-2 rounded-full bg-gradient-to-r from-purple-200 to-pink-400">
                          <Image
                            src="/user-avatar.jpg"
                            alt="user avatar"
                            width={540}
                            height={540}
                            className="rounded-full object-cover size-[120px]"
                          />
                       </div>
                    </div>
                    <h3 className="text-black font-bold text-2xl">{ userName }</h3>
                </div>
            </div>
        </div>
            { messages.length > 0 && (
                <div className = " transcript-border">
                    <div className = "transcript">
                        <p key = { latestMessage } className = { cn('transition-opacity duration-500 opacity-0', ' animate-fadeIn opacity-100' )}>
                            { latestMessage }
                        </p>
                    </div>
                </div>
            )}

            <div className = "w-full flex justify-center">
                { callStatus !== 'ACTIVE' ? (
                    <button className = "relative btn-call" onClick = { handleCall }>
                        <span className = { cn('absolute animate-ping rounded-full opacity-75', callStatus !=='CONNECTING' && 'hidden' )}/>

                        <span>
                             { isCallInactiveOrFinished ? 'Call' : '. . .'}
                        </span>
                    </button>
                ) : (
                    <button className = "btn-disconnect" onClick={ handleDisconnect }>
                        End
                    </button>
                )}
            </div>
        </>
    )
}
export default Agent
