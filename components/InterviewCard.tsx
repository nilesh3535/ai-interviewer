import dayjs from "dayjs";
import Link from "next/link";
import Image from "next/image";

import DisplayTechIcons from "./DisplayTechIcons";
import { cn, getRandomInterviewCover } from "@/lib/utils";
import { MetalButton } from "./MetalButton";
import { interviewCovers, mappings,iconsColors } from "@/constants";
// Add feedback to props
interface InterviewCardProps {
  interviewId: string;
  userId: string;
  role: string;
  type: string;
  techstack: string[];
  createdAt: Date | string;
  coverImage?: string;
  level: string;
  questions: any[];
  feedback?: {
    createdAt?: string | Date;
    totalScore?: number;
    finalAssessment?: string;
  } | null;
}

const InterviewCard = ({
  interviewId,
  userId,
  role,
  type,
  techstack,
  createdAt,
  coverImage,
  level,
  questions,
  feedback, // ✅ directly use the prop
}: InterviewCardProps) => {
  const normalizedType = /mix/gi.test(type) ? "Mixed" : type;

  const typeBadgeColor =
    {
      Behavioral: "bg-light-800",
      Mixed: "bg-yellow-600",
      Technical: "bg-blue-600",
    }[normalizedType] || "bg-violet-600";

  const levelBadgeColor = {
    "entry level": "bg-emerald-600",
    beginner: "bg-teal-600",
    junior: "bg-lime-600",
    "mid to senior": "bg-amber-500",
    senior: "bg-orange-500",
    advanced: "bg-sky-600",
    expert: "bg-indigo-600",
  }[level?.toLowerCase() || "beginner"] || "bg-green-600";

  const formattedDate = dayjs(
    feedback?.createdAt || createdAt || Date.now()
  ).format("MMM D, YYYY");

  const imageSrc = coverImage || getRandomInterviewCover();
  return (
    <div className="card-border w-[360px] max-sm:w-full min-h-96">
      <div className="card-interview">
        <div>
          {/* Type Badge - Top Right */}
          <div
            className={cn(
              "absolute top-0 right-0 w-fit px-4 py-2 rounded-bl-lg z-10",
              typeBadgeColor
            )}
          >
            <p className="badge-text font-medium text-white">
              {normalizedType.toLowerCase().replaceAll("interview","")}
              </p>
          </div>

          {/* Level Badge - Top Left */}
          <div
            className={cn(
              "absolute top-0 left-0 w-fit px-4 py-2 rounded-br-lg z-10",
              levelBadgeColor
            )}
          >
            <p className="badge-text font-medium text-white capitalize">{level || "Beginner"}</p>
          </div>

          {/* Cover Image */}
          <div
          style={{ backgroundColor: iconsColors[imageSrc.split("/")[2]] ,
             boxShadow: "0px 4px 10px rgba(219, 208, 208, 0.3)"
          }}
          className="rounded-full size-[80px] mt-6 mx-auto flex items-center justify-center text-white text-xs font-semibold border-[3px] border-[#d9e0e691] "
        >
          <h1 className="font-bold text-2xl">
          {
                              role.split(" ").length === 1
                                ? role[0].toUpperCase() + "I"
                                : role.split(" ")[0][0].toUpperCase() + role.split(" ")[role.split(" ").length - 1][0].toUpperCase()
                            }
          </h1>
          </div>
         

          {/* Interview Role */}
          <h3 className="my-5 line-clamp-1 capitalize">{role.toLowerCase().includes("interview") ? role : `${role} Interview`}
          </h3>

          {/* Date & Score & Questions Count */}
          <div className="flex flex-row flex-wrap gap-5 mt-3">
            <div className="flex flex-row gap-2">
              <Image
                src="/calendar.svg"
                width={22}
                height={22}
                alt="calendar icon"
              />
              <p>{formattedDate}</p>
            </div>

            <div className="flex flex-row gap-2 items-center">
              <Image 
                src="/star-2.svg" 
                width={22} 
                height={22} 
                alt="star icon"
              />
              <p>{feedback?.totalScore || "---"}/100</p>
            </div>
            
            <div className="flex flex-row gap-2 items-center">
              <Image 
                src="/question.svg" 
                width={22} 
                height={22} 
                alt="question icon" 
              />
              <p>
                {questions?.length || 0}
              </p>
            </div>
          </div>

          {/* Feedback or Placeholder Text */}
          <p className="line-clamp-2 mt-5">
            {feedback?.finalAssessment ||
              "You haven't taken this interview yet. Take it now to improve your skills."}
          </p>
        </div>

        <div className="flex flex-row justify-between items-start">
          <DisplayTechIcons techStack={techstack} />
           <div className="flex flex-col items-end space-y-2">
            <Link
              href={
                feedback
                  ? `/interview/${interviewId}/feedback`
                  : `/interview/${interviewId}`
              }
            >
              {feedback ? <MetalButton variant="primary">Check Feedback</MetalButton> : <MetalButton variant="bronze">Start Interview</MetalButton>}
            </Link>
            {feedback && (
                 <Link
                href={`/interview/${interviewId}`}
              >
                   <MetalButton variant="bronze">Retake Interview</MetalButton>
                </Link>)}
            </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewCard;
