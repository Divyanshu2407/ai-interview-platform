import React from 'react'
import Image from "next/image";
import {cn} from "@/lib/utils";

enum CallStatus {
    INACTIVE = "INACTIVE",
    CONNECTING = "CONNECTING",
    ACTIVE = "ACTIVE",
    FINISHED = "FINISHED",
}

const Agent = ({ userName }: AgentProps ) => {
    const callStatus = CallStatus.ACTIVE;
    const isSpeaking = true;
    const messages = [
        'whats your name ?',
        'My name is D K, nice to meet you!'
    ];
    const lastMessage = messages[messages.length - 1];

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
                        <p key = { lastMessage } className = { cn('transition-opacity duration-500 opacity-0', ' animate-fadeIn opacity-100' )}>
                            {lastMessage}
                        </p>
                    </div>
                </div>
            )}

            <div className = "w-full flex justify-center">
                { callStatus !== 'ACTIVE' ? (
                    <button className = "relative btn-call">
                        <span className = { cn('absolute animate-ping rounded-full opacity-75', callStatus !=='CONNECTING' & 'hidden' )}/>

                        <span>
                             { callStatus === 'INACTIVE' || callStatus === 'FINISHED' ? 'Call' : '. . .'}
                        </span>
                    </button>
                ) : (
                    <button className = "btn-disconnect">
                        End
                    </button>
                )}
            </div>
        </>
    )
}
export default Agent
