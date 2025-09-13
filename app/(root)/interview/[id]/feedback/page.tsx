import dayjs from "dayjs";
import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { getFeedbackByInterviewId, getInterviewById } from "@/lib/actions/general.action";
import { Button } from "@/Components/ui/button";
import { getCurrentUser } from "@/lib/actions/auth.action";

interface FeedbackPageProps {
    params: { id: string };
}

const Feedback = async ({ params }: FeedbackPageProps) => {
    const { id: interviewId } = await params;
    const user = await getCurrentUser();

    if (!user) {
        console.warn("User not authenticated, redirecting to sign-in.");
        redirect("/sign-in");
    }

    const interview = await getInterviewById(interviewId);
    if (!interview) {
        console.error("No interview found for ID:", interviewId);
        return <p className="text-center mt-10">Interview not found. It may have been deleted or not created.</p>;
    }

    const feedback = await getFeedbackByInterviewId({
        interviewId,
        userId: user!.id!,
    });

    if (!feedback) {
        return <p className="text-center mt-10">No feedback found for this interview.</p>;
    }

    let createdAt: string | null = null;
    if (feedback.createdAt) {
        if (typeof feedback.createdAt === "string") {
            createdAt = feedback.createdAt;
        } else if ("toDate" in feedback.createdAt) {
            createdAt = feedback.createdAt.toDate().toISOString();
        } else if (feedback.createdAt instanceof Date) {
            createdAt = feedback.createdAt.toISOString();
        }
    }

    return (
        <section className="section-feedback">
            <div className="flex flex-row justify-center">
                <h1 className="text-4xl font-semibold">
                    Feedback on the Interview -{" "}
                    <span className="capitalize">{ interview.role } </span> Interview
                </h1>
            </div>
            <div className="flex flex-row justify-center mt-4">
                <div className="flex flex-row gap-5">
                    <div className="flex flex-row gap-2 items-center">
                        <Image src="/star.svg" width={22} height={22} alt="star" />
                        <p>
                            Overall Impression:{" "}
                            <span className="text-primary-200 font-bold">{feedback.totalScore}</span>
                            /100
                        </p>
                    </div>
                    <div className="flex flex-row gap-2 items-center">
                        <Image src="/calendar.svg" width={22} height={22} alt="calendar" />
                        <p>{createdAt ? dayjs(createdAt).format("MMM D, YYYY h:mm A") : "N/A"}</p>
                    </div>
                </div>
            </div>
            <hr className="my-4" />
            <p className="mb-4">{feedback.finalAssessment}</p>
            <div className="flex flex-col gap-4 mb-4">
                <h2 className="font-semibold">Breakdown of the Interview:</h2>
                {feedback.categoryScores?.map((category, index) => (
                    <div key={index}>
                        <p className="font-bold">
                            {index + 1}. {category.name} ({category.score}/100)
                        </p>
                        <p>{category.comment}</p>
                    </div>
                ))}
            </div>

            <div className="flex flex-col gap-3 mb-4">
                <h3 className="font-semibold">Strengths</h3>
                <ul className="list-disc list-inside">
                    {feedback.strengths?.map((strength, index) => (
                        <li key={index}>{strength}</li>
                    ))}
                </ul>
            </div>

            <div className="flex flex-col gap-3 mb-6">
                <h3 className="font-semibold">Areas for Improvement</h3>
                <ul className="list-disc list-inside">
                    {feedback.areasForImprovement?.map((area, index) => (
                        <li key={index}>{area}</li>
                    ))}
                </ul>
            </div>

            <div className="buttons flex gap-4 flex-wrap">
                <Link href="/" className="flex-1">
                    <Button className="w-full rounded-full shadow-md text-black font-semibold
                                       bg-gradient-to-r from-purple-200 to-pink-400
                                       transition-all duration-400 ease-in-out
                                       hover:scale-105 hover:shadow-lg">
                        Return to Dashboard
                    </Button>
                </Link>

                <Link href={`/interview/${interviewId}`} className="flex-1">
                    <Button className="w-full rounded-full text-black font-semibold
                                       bg-gradient-to-r from-purple-200 to-pink-400
                                       transition-all duration-500 ease-in-out
                                       hover:scale-105 hover:shadow-lg">
                        Reattempt Interview
                    </Button>
                </Link>
            </div>
        </section>
    );
};

export default Feedback;
