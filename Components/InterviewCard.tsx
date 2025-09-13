"use client";

import React from "react";
import dayjs from "dayjs";
import Image from "next/image";
import { cn, getInterviewCover, getTechLogos } from "@/lib/utils";
import Link from "next/link";
import { Button } from "./ui/button";
import DisplayTechIcons from "@/Components/DisplayTechIcons";

type InterviewCardProps = {
    id: string;
    userId: string;
    role: string;
    type: string;
    techstack: string[];
    createdAt: string ;
    feedback: any | null;
};

const InterviewCard =  ({
                           id,
                           userId: _userId, // intentionally unused here
                           role,
                           type,
                           techstack,
                           createdAt,
                           feedback,
                       }: InterviewCardProps) => {
    const normalizedType = /mix/gi.test(type) ? "Mixed" : type;

    const badgeColor =
        {
            Behavioral: "bg-light-400",
            Mixed: "bg-light-600",
            Technical: "bg-light-800",
        }[normalizedType] || "bg-light-600";

    // ✅ Normalize Firestore Timestamp | Date | string
    const formattedDate = dayjs(
        feedback?.createdAt || createdAt || Date.now()
    ).format("MMM D, YYYY");

    // deterministic cover for SSR/client parity
    const cover = getInterviewCover(id);

    // sync mapping of tech -> icon url
    const techIcons = getTechLogos(techstack || []);

    return (
        <div className="card-border w-[360px] max-sm:w-full min-h-96">
            <div className="card-interview relative flex flex-col h-full p-4">
                <div>
                    {/* Badge */}
                    <div
                        className={cn(
                            "absolute top-0 right-0 px-4 py-2 rounded-bl-lg",
                            badgeColor
                        )}
                    >
                        <p className="bg-gradient-to-r from-purple-200 to-pink-400 text-transparent bg-clip-text font-bold">
                            {normalizedType}
                        </p>
                    </div>

                    {/* Cover Image */}
                    <div className="flex flex-col items-center mt-6">
                    <Image
                        src={cover}
                        alt="cover image"
                        width={80}
                        height={80}
                        className="rounded-full object-cover size-[70px]"
                    />

                        <h3 className="mt-4 text-lg font-semibold capitalize text-center">
                            {role} Interview
                        </h3>
                    </div>

                    {/* Score & Date */}
                    <div className="flex justify-center gap-8 mt-5 text-gray-800">
                        <div className="flex items-center gap-2">
                            <Image src="/star.svg" alt="star" width={22} height={22} />
                            <p className="font-medium">{feedback?.totalScore ?? "---"}/100</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Image src="/calendar.svg" alt="calendar" width={22} height={22} />
                            <p className="font-medium">{formattedDate}</p>
                        </div>
                    </div>

                    {/* Summary on Interview Card */}
                    <p className="mt-6 line-clamp-3 text-center text-sm leading-relaxed">
                        {feedback?.finalAssessment ??
                            "You haven't taken this interview yet. Dive in now to level up your skills!"}
                    </p>
                </div>

                {/* Tech icons & Action Button */}
                <div className="flex justify-between items-center mt-auto pt-6">
                    <DisplayTechIcons techIcons={techIcons} />

                    <Link href={feedback?.id ? `/interview/${id}/feedback` : `/interview/${id}`}>
                        <Button
                            className="btn-primary relative overflow-hidden text-white font-bold rounded-full shadow-md
                                           bg-gradient-to-r from-purple-200 to-pink-400
                                           transition-all duration-500 ease-in-out
                                           hover:scale-105 hover:shadow-lg"
                        >
                            {feedback?.id ? "View Feedback" : "View Interview"}
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default InterviewCard;
