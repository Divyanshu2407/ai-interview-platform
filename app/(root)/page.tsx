import React from 'react'
import {Button} from "../../Components/ui/button";
import Link from "next/link";
import Image from "next/image";
import InterviewCard from "@/Components/InterviewCard";
import {getCurrentUser, getInterviewsByUserId} from "@/lib/actions/auth.action";

const Page = async () => {
    const user = await getCurrentUser();

    const [userInterviews, latestInterviews] = await Promise.all([
        await getInterviewsByUserId( user?.id!),
        await getInterviewsByUserId({ userId: user?.id! }),
    ]);

    const hasPastInterviews = userInterviews?.length > 0;
    const hasUpcomingInterviews = latestInterviews?.length > 0;

    return (
        <>
            <section
                className="card-cta bg-gradient-to-r from-purple-200 to-pink-400 rounded-2xl p-8 flex items-center justify-between gap-8 shadow-lg shadow-pink-300/30"
            >
                <div className="flex flex-col gap-6 max-w-lg">
                    <h2 className="text-black font-bold text-2xl">
                        Get interview-ready with AI-powered practice and feedback
                    </h2>
                    <p className="text-lg text-black">
                        Practice real interview questions with instant feedback
                    </p>


                        <Button
                            asChild
                            className="btn relative overflow-hidden text-black font-bold rounded-full shadow-lg
                            bg-gradient-to-r from-purple-200 to-pink-400
                            transition-all duration-500 ease-out
                            hover:scale-104 hover:shadow-lg max-sm:w-full "
                        >
                            <Link href="/interview">Start an Interview</Link>
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
                <div className="interviews-section">
                    { hasPastInterviews ? (
                            userInterviews?.map((interview) => (
                                <InterviewCard {...interview} key={interview.id}/>
                            ))) : (
                                <p> You haven&pos;t taken any interviews yet</p>
                            )}
                </div>
            </section>

            <section className="flex flex-col gap-6 mt-8">
                <h2>Take an Interview</h2>
                <div className="interviews-section">
                    { hasUpcomingInterviews ? (
                        latestInterviews?.map((interview) => (
                            <InterviewCard {...interview} key={interview.id}/>
                        ))) : (
                        <p> There are no new interviews available </p>
                    )}
                </div>
            </section>
        </>
    )
}
export default Page
