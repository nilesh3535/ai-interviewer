
import Image from "next/image";

import Link from "next/link";

import InterviewCard from "@/components/InterviewCard"; // Grid view
import InterviewCardList from "@/components/InterviewCardList"; // List view

import { List, LayoutGrid } from 'lucide-react';

import { getCurrentUser } from "@/lib/actions/auth.action";
import {
  getInterviewsByUserId,
  getLatestInterviews,
  getFeedbackByInterviewId,
} from "@/lib/actions/general.action";
import AnimatedCTAButton from "@/components/AnimatedCTAButton";
import AnimatedText from "@/components/AnimatedText";
import Footer from "@/components/Footer";
import { toast } from "sonner";

interface HomeProps {
  searchParams?: { view?: string };
}

async function Home({ searchParams }: HomeProps) {
  const user = await getCurrentUser();

  const [userInterviews] = await Promise.all([
    getInterviewsByUserId(user?.id || ''),
    getLatestInterviews({ userId: user?.id || '' }),
  ]);

  const hasPastInterviews = (userInterviews?.length ?? 0) > 0;
  const allInterview = await getInterviewsByUserId('');
  const viewMode = searchParams?.view === 'grid' ? 'grid' : 'list';

  // ✅ Fetch feedback for each interview in parallel
  const feedbackList = await Promise.all(
    userInterviews.map(interview =>
      getFeedbackByInterviewId({
        interviewId: interview.id,
        userId: user?.id || '',
      })
    )
  );

  // Map feedbacks by interviewId for quick lookup
  const feedbackMap = userInterviews.reduce((acc, interview, idx) => {
    acc[interview.id] = feedbackList[idx];
    return acc;
  }, {} as Record<string, any>);


  return (
    <>
     <section className="card-cta flex-col-reverse md:flex-row items-center">
    
        <div className="flex flex-col gap-6 max-w-1/1.1 mt-6 sm:mt-0">
          <AnimatedText delay={0.1}>
            <h2><span className="text-orange-300">AI-Powered</span> Real-Time Interview Platform for Smarter Hiring</h2>
          </AnimatedText>
          
          <AnimatedText delay={0.2}>
            <p className="text-lg">
              Practice real interview questions & get instant feedback.<br />
              For example: Frontend, Backend, Fullstack, Design, UX/UI.
            </p>
          </AnimatedText>
           <div className="gap-2 max-w-full flex flex-col md:flex-row sm:flex-col">
          <AnimatedCTAButton href="/create" delay={0.3}>
            Create an Interview
          </AnimatedCTAButton>
             {/* <AnimatedCTAButton href="/jobs/resume-checker" delay={0.3}>
            ATS Resume Checker
          </AnimatedCTAButton>
           <AnimatedCTAButton href="/jobs" delay={0.3}>
            Find Jobs
          </AnimatedCTAButton> */}
         
          </div>
        </div>

        <Image
          src="/robott.png"
          alt="Robot here"
          width={400}
          height={254}
          className="w-[250px] sm:w-[400px] mx-auto mb-0 sm:mx-0 sm:mb-4 md:mb-0"
        />
      </section>
      <section className="flex flex-col gap-6 mt-8">
        <div className="flex flex-row items-center justify-between">
          <h2>Interviews created by you</h2>

          <div className="hidden md:flex gap-2">
            <Link
              href="?view=list"
              className={`flex items-center gap-2 px-4 py-2 rounded-md transition ${
                viewMode === "list"
                  ? "bg-gray-800 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              <List className="w-5 h-5" />
              List View
            </Link>

            <Link
              href="?view=grid"
             
              className={`flex items-center gap-2 px-4 py-2 rounded-md transition ${
                viewMode === "grid"
                  ? "bg-gray-800 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              <LayoutGrid className="w-5 h-5" />
              Grid View
            </Link>
          </div>
        </div>

        {hasPastInterviews ? (
          <>
            {/* Grid view for mobile */}
            <div className="grid grid-cols-1 gap-4 md:hidden">
              {userInterviews.map((interview) => (
                <InterviewCard
                  key={interview.id}
                  userId={user?.id}
                  interviewId={interview.id}
                  role={interview.role}
                  type={interview.type}
                  techstack={interview.techstack}
                  createdAt={interview.createdAt}
                  coverImage={interview.coverImage}
                  level={interview.level}
                  questions={interview.questions}
                  feedback={feedbackMap[interview.id]} // ✅ pass feedback
                />
              ))}
            </div>

            {/* Conditional view for desktop */}
            <div className={`${
              viewMode === "grid"
                ? "grid md:grid-cols-2 lg:grid-cols-3 gap-6"
                : "flex flex-col gap-4"
            } hidden md:grid md:flex`}>
              {userInterviews.map((interview) =>
                viewMode === "list" ? (
                  <InterviewCardList
                    key={interview.id}
                    userId={user?.id}
                    interviewId={interview.id}
                    role={interview.role}
                    type={interview.type}
                    techstack={interview.techstack}
                    createdAt={interview.createdAt}
                    coverImage={interview.coverImage}
                    level={interview.level}
                    questions={interview.questions}
                    feedback={feedbackMap[interview.id]} // ✅ pass feedback
                  />
                ) : (
                  <InterviewCard
                    key={interview.id}
                    userId={user?.id}
                    interviewId={interview.id}
                    role={interview.role}
                    type={interview.type}
                    techstack={interview.techstack}
                    createdAt={interview.createdAt}
                    coverImage={interview.coverImage}
                    level={interview.level}
                    questions={interview.questions}
                    feedback={feedbackMap[interview.id]} // ✅ pass feedback
                  />
                )
              )}
            </div>
          </>
        ) : (
          <p>You haven&apos;t created or taken any interviews yet</p>
        )}
      </section>

      <Footer />
    </>
  );
}

export default Home;
