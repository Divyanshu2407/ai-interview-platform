import React from "react";
import { Button } from "@/Components/ui/button";
import Link from "next/link";
import Image from "next/image";
import InterviewCard from "@/Components/InterviewCard";
import { getInterviewsByUserId, getLatestInterviews, getFeedbackByInterviewId } from "@/lib/actions/general.action";
import { getCurrentUser } from "@/lib/actions/auth.action";

const Page = async () => {
    const user = await getCurrentUser();

    if (!user) return <p>Please log in to see your interviews.</p>;

    const [userInterviews, allInterviews] = await Promise.all([
        getInterviewsByUserId(user.id),
        getLatestInterviews({ userId: user.id }),
    ]);

    const feedbackMap: Record<string, any> = {};
    if (userInterviews?.length) {
        await Promise.all(
            userInterviews.map(async (interview) => {
                try {
                    const feedback = await getFeedbackByInterviewId({
                        interviewId: interview.id,
                        userId: user.id,
                    });
                    console.log(`Feedback for ${interview.id}:`, feedback);
                    if (feedback) {
                        feedbackMap[interview.id] = feedback;
                    }
                } catch (err) {
                    console.error(`Failed to fetch feedback for interview ${interview.id}:`, err);
                }
            })
        );
    }

    const hasPastInterviews = (userInterviews || []).length > 0;
    const hasUpcomingInterviews = (allInterviews || []).length > 0;

    return (
        <>
            <section className="card-cta bg-gradient-to-r from-purple-200 to-pink-400
                                rounded-2xl p-6 md:items-start justify-between gap-8 shadow-lg shadow-pink-300">
                <div className="flex flex-col gap-6 max-w-xl text-center md:text-left">
                    <h2 className="text-black font-bold text-2xl md:text-4xl leading-snug max-w-xl">
                        Ace your interviews with <br /> AI-powered practice and feedback
                    </h2>
                    <p className="text-2lg text-black foont font-semibold py-2 px-1">
                        Practice real interview questions with instant feedback.
                    </p>

                    <Button
                        asChild
                        className="btn relative overflow-hidden text-black font-bold rounded-full shadow-lg
                                    bg-gradient-to-r from-purple-500 to-pink-500
                                    transition-all duration-500 ease-in-out
                                    hover:scale-105 hover:shadow-3xl max-sm:w-full">
                        <Link href="/interview"> Start Interview </Link>
                    </Button>
                </div>

                <Image
                    src="/robot.png"
                    alt="robo"
                    width={400}
                    height={400}
                    className="max-sm:hidden"
                />
            </section>

            <section className="flex flex-col gap-6 mt-8">
                <h2>Your Interviews</h2>
                <div className="interviews-section flex flex-wrap gap-6">
                    {hasPastInterviews ? (
                        userInterviews.map((interview) => {
                            const feedback = feedbackMap[interview.id] || null;
                            return (
                                <InterviewCard
                                    key={interview.id}
                                    id={interview.id}
                                    userId={user?.id}
                                    role={interview.role}
                                    type={interview.type}
                                    techstack={interview.techstack}
                                    createdAt={interview.createdAt?.toDate?.() || interview.createdAt}
                                    feedback={feedback}
                                />
                            );
                        })
                    ) : (
                        <p>You haven&apos;t taken any interviews yet</p>
                    )}
                </div>
            </section>

            <section className="flex flex-col gap-6 mt-8">
                <h2>Take Interview</h2>
                <div className="interviews-section flex flex-wrap gap-6">
                    {hasUpcomingInterviews ? (
                        allInterviews.map((interview) => (
                            <InterviewCard
                                key={interview.id}
                                id={interview.id}
                                userId={user.id}
                                role={interview.role}
                                type={interview.type}
                                techstack={interview.techstack}
                                createdAt={interview.createdAt?.toDate?.() || interview.createdAt}
                                feedback={feedbackMap[interview.id] || null }
                            />
                        ))
                    ) : (
                        <p>No new interviews right now</p>
                    )}
                </div>
            </section>
        </>
    );
};

export default Page;
