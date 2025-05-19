import dayjs from "dayjs";
import Link from "next/link";
import Image from "next/image";

import DisplayTechIcons from "./DisplayTechIcons";
import { cn, getRandomInterviewCover } from "@/lib/utils";
import { MetalButton } from "./MetalButton";
import { iconsColors } from "@/constants";

// Add feedback to props
interface InterviewCardListProps {
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

const InterviewCardList = ({
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
}: InterviewCardListProps) => {
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
        <div className="border border-gradient p-0.5 rounded-2xl w-full">
          <div className="flex w-full min-h-32 px-5 py-4 gap-5 items-center rounded-2xl bg-gradient-to-b from-[#1A1C20] to-[#08090D] text-white">
            {/* Left: Image with badges */}
            <div className="relative">
              {/* <Image
                src={imageSrc}
                alt="cover"
                width={80}
                height={80}
                className="rounded-full object-cover size-[80px]"
              /> */}
              <div
                        style={{ backgroundColor: iconsColors[imageSrc.split("/")[2]] ,
                          boxShadow: "0px 4px 10px rgba(219, 208, 208, 0.3)"}}
                        className="rounded-full size-[80px] mt-3 mx-auto flex items-center justify-center text-white text-xs font-semibold border-[3px] border-[#d9e0e691]"
                      >
                        <h1 className="font-bold text-2xl">
                        {
                              role.split(" ").length === 1
                                ? role[0].toUpperCase() + "I"
                                : role.split(" ")[0][0].toUpperCase() + role.split(" ")[role.split(" ").length - 1][0].toUpperCase()
                            }
                        </h1>
                        </div>
              <div className={cn("absolute -top-0 -left-2 text-xs px-3 py-0.5 rounded-md text-white", typeBadgeColor)}>
                {normalizedType.toLocaleLowerCase().replaceAll("interview", "")}
              </div>
              <div className={cn("absolute -bottom-2 -right-2 text-xs px-2 py-0.5 rounded-md text-white capitalize", levelBadgeColor)}>
                {level || "Beginner"}
              </div>
            </div>
      
            {/* Middle: Details */}
            <div className="flex-1 flex flex-col gap-1">
              <h3 className="font-semibold text-lg capitalize">
                {role.toLowerCase().includes("interview") ? role : `${role} Interview`}
              </h3>
      
              <div className="flex gap-4 text-sm text-gray-300">
                <div className="flex items-center gap-1">
                  <Image src="/calendar.svg" width={16} height={16} alt="calendar" />
                  <span>{formattedDate}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Image src="/star-2.svg" width={16} height={16} alt="score" />
                  <span>{feedback?.totalScore || "---"}/100</span>
                </div>
                <div className="flex items-center gap-1">
                  <Image src="/question.svg" width={16} height={16} alt="questions" />
                  <span>{questions?.length || 0} Qs</span>
                </div>
              </div>
      
              <p className="text-sm text-gray-400 mt-1 line-clamp-2">
                {feedback?.finalAssessment ||
                  "You haven't taken this interview yet. Take it now to improve your skills."}
              </p>
      
              <DisplayTechIcons techStack={techstack} />
            </div>
      
            {/* Right: Action */}
            <div className="flex flex-col items-center justify-end gap-5">
              
              <Link
                href={feedback ? `/interview/${interviewId}/feedback` : `/interview/${interviewId}`}
              >
                {feedback ? (
                  <MetalButton variant="primary">Check Feedback</MetalButton>
                ) : (
                  <MetalButton variant="bronze">Start Interview </MetalButton>
                )}
               
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
      );
    }      

export default InterviewCardList;