import Image from "next/image";
import { redirect } from "next/navigation";
import { getInterviewCover } from "@/lib/utils";
import { getFeedbackByInterviewId, getInterviewById } from "@/lib/actions/general.action";
import { getCurrentUser } from "@/lib/actions/auth.action";
import DisplayTechIcons from "@/Components/DisplayTechIcons";
import Agent from "@/Components/Agent";

const InterviewDetails = async ({params}: RouteParams) => {
    const {id} = params;

    if (!id) {
        console.error("No interview ID provided in route params");
        redirect("/");
    }

    const user = await getCurrentUser();
    const interview = await getInterviewById(id);

    if (!interview) {
        console.error(" Interview not found in Firestore for ID:", id);
        redirect("/");
    }

    let feedback = null;
    try {
        if (user?.id) {
            feedback = await getFeedbackByInterviewId({
                interviewId: id,
                userId: user.id,
            });
        } else {
            console.warn(" No user found while fetching feedback");
        }
    } catch (err) {
        console.error(" Error fetching feedback for interview:", id, err);
    }

    return (
        <>
            <div className="flex flex-row gap-4 justify-between">
                <div className="flex flex-row gap-4 items-center max-sm:flex-col">
                    <div className="flex flex-row gap-4 items-center">
                        <Image
                            src={getInterviewCover(id)}
                            alt="cover-image"
                            width={40}
                            height={40}
                            className="rounded-full object-cover size-[40px]"
                        />
                        <h3 className="capitalize"> {interview.role} Interview</h3>
                    </div>
                    <DisplayTechIcons techStack={interview.techstack}/>
                </div>
                <p className="bg-gradient-to-r from-purple-200 to-pink-400 text-transparent bg-clip-text font-bold capitalize">
                    {interview.type}
                </p>
            </div>

            {feedback && feedback.generatedFeedback && (
                <div className="mt-4 p-4 bg-pink-400 rounded-2xl shadow-lg">
                    <h4 className="text-2xl text-black font-bold text-center">AI-Generated Feedback </h4>
                    <p className="mt-5 text-gray-600 font-semibold whitespace-pre-wrap">
                        {feedback.generatedFeedback}
                    </p>
                </div>
            )}

            <Agent
                userName={user?.name}
                userId={user?.id}
                interviewId={id}
                type="interview"
                questions={interview.questions}
                feedbackId={feedback?.id}
            />
        </>
    );
};

export default InterviewDetails;
