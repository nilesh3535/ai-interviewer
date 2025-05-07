// components/UserInterviewsSection.tsx
"use client";

import { useState } from "react";
import { List, LayoutGrid } from 'lucide-react';
import InterviewCard from "./InterviewCard";
import InterviewCardList from "./InterviewCardList";

export default function UserInterviewsSection({ userId, userInterviews }: any) {
  const [typeView, setTypeView] = useState<"list" | "grid">("list");

  const hasPastInterviews = (userInterviews?.length ?? 0) > 0;

  return (
    <section className="flex flex-col gap-6 mt-8">
      <div className="flex flex-row items-center justify-between">
        <h2>Interviews created by you</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setTypeView("list")}
            className={`flex items-center gap-2 px-4 py-2 rounded-md transition ${
              typeView === "list" ? "bg-gray-300" : "bg-gray-200"
            }`}
          >
            <List className="w-5 h-5" />
            List View
          </button>
          <button
            onClick={() => setTypeView("grid")}
            className={`flex items-center gap-2 px-4 py-2 rounded-md transition ${
              typeView === "grid" ? "bg-gray-300" : "bg-gray-200"
            }`}
          >
            <LayoutGrid className="w-5 h-5" />
            Grid View
          </button>
        </div>
      </div>

      <div className="interviews-section">
        {hasPastInterviews ? (
          userInterviews.map((interview: any) =>
            typeView === "grid" ? (
              <InterviewCard
                key={interview.id}
                userId={userId}
                interviewId={interview.id}
                role={interview.role}
                type={interview.type}
                techstack={interview.techstack}
                createdAt={interview.createdAt}
                coverImage={interview.coverImage}
                level={interview.level}
                questions={interview.questions}
              />
            ) : (
              <InterviewCardList
                key={interview.id}
                userId={userId}
                interviewId={interview.id}
                role={interview.role}
                type={interview.type}
                techstack={interview.techstack}
                createdAt={interview.createdAt}
                coverImage={interview.coverImage}
                level={interview.level}
                questions={interview.questions}
              />
            )
          )
        ) : (
          <p>You haven&apos;t created or taken any interviews yet</p>
        )}
      </div>
    </section>
  );
}
