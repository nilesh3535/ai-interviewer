// jobs/page.tsx
"use client"; // Make this a client component

import JobListSection from "@/components/JobListSection";
import LogoCarousel from "@/components/LogoCarousel";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect } from "react";
// Lottie and toast imports stay
import { toast } from "sonner";
import moment from "moment";
import LastSearchInfo from "@/components/LastSearchInfo";
import Footer from "@/components/Footer";

import {fetchUserDataAndJobs } from "@/lib/actions/jobs.action";
import Lottie, { LottieComponentProps } from "lottie-react";
import { getCurrentUser } from "@/lib/actions/auth.action";



/**
 * Main App Component
 * This component renders the entire page and manages the global theme state.
 */
type DeviceSize = "mobile" | "medium" | "desktop";

function getDeviceSize(width: number): DeviceSize {
  if (width < 768) return "mobile";      // Tailwind: < md
  if (width < 1024) return "medium";     // Tailwind: < lg
  return "desktop";                      // Tailwind: lg and up
};
// interface User {
//   id: string;
//   name: string;
//   email: string;
//   photoURL?: string;
//   emailVerified?: boolean;
//   packs?:string
// }
interface ApplyOption {
  is_direct: boolean;
  publisher: string;
  apply_link: string;
}

interface Job {
  id: number;
  job_id: string;
  search_data: string;
  job_title: string;
  employer_name: string;
  employer_logo: string;
  employer_website: string | null;
  job_publisher: string;
  job_employment_type: string;
  job_employment_types: string[];
  job_apply_link: string;
  job_apply_is_direct: boolean;
  apply_options: ApplyOption[];
  job_description: string;
  job_is_remote: boolean;
  job_posted_at: string;
  job_posted_at_timestamp: number;
  job_posted_at_datetime_utc: string;
  job_location: string;
  job_city: string;
  job_state: string;
  job_country: string;
  job_latitude: number;
  job_longitude: number;
  job_benefits: string | null;
  job_google_link: string;
  job_salary: number | null;
  job_min_salary: number | null;
  job_max_salary: number | null;
  job_salary_period: string | null;
  job_highlights: string | null;
  job_onet_soc: number;
  job_onet_job_zone: number;
  candidate_id: string;
  created_date: string;
}
export default function JobApp() {
 
  const [loading, setLoading] = useState(true);
  const [allJobs, setAllJobs] = useState<Job[]>([]);
  const [animationData, setAnimationData] = useState<LottieComponentProps["animationData"] | null>(null);

  // Move these useState calls to the top, before any early returns
   const [size, setSize] = useState(() => {
    if (typeof window !== "undefined") { // This is correct
      return getDeviceSize(window.innerWidth);
    }
    return "desktop";
  });
  // const [position, setPosition] = useState("");

  useEffect(() => {
  

    const initializeAppData = async () => {
      // Load Lottie animation data
      const res = await fetch("/loaders/dataloader.json");
      const json = await res.json();
      setAnimationData(json);

      // Fetch user data and jobs

      const currentUser = await getCurrentUser();
        const userId = currentUser?.id;

        if (!userId) {
          console.error("No user ID found.");
          return;
        }
      
        const alldata = await fetchUserDataAndJobs({ userId });
        setAllJobs(alldata);
        setLoading(false);
      
    };

    initializeAppData();
  }, []);


  // Move this useEffect for window resize to the top, before early return
useEffect(() => {
    if (typeof window === "undefined") return; // This is correct
    const handleResize = () => {
      const newSize = getDeviceSize(window.innerWidth);
      setSize(newSize);
    };
    window.addEventListener("resize", handleResize);
    // Set initial size on mount
    handleResize();
    return () => window.removeEventListener("mousedown", handleResize); // Corrected cleanup
  }, []);

  // Move this useEffect for theme to the top, before early return


  // Now, your early return is safe because all hooks have been called
  if (loading || !animationData) {
    return (
      <div className="fixed inset-0 z-50 bg-[#17195000] dark:bg-white/5 text-white">
        <div className="relative flex lg:flex-row w-full h-screen justify-center flex-col sm:p-0">
          <div className="lg:w-1/2 w-full h-full lg:grid items-center hidden">
            <div className="relative items-center justify-center flex z-1 flex-col gap-4">
              <Lottie animationData={animationData} loop autoplay className="w-48 h-48" />
            </div>
          </div>
          <div className="lg:hidden flex justify-center items-center w-full h-full bg-[#17195000] dark:bg-white/5">
            <Lottie animationData={animationData} loop autoplay className="w-48 h-48" />
          </div>
        </div>
      </div>
    );
  }

  
      //  

  
  // const handleSubmit = (e: React.FormEvent) => {
  //   e.preventDefault();
  //    getJobs();
  // };





  return (
    <div data-theme={"night"} className="min-h-screen bg-base-100 text-base-content font-sans transition-colors duration-300">
      {/* header */}
      <nav className="navbar px-4 sm:px-20" role="navigation" aria-label="Main navigation">
        <div className="flex-1 flex items-center">
         {/* nextjs image */}
         <Link href="/jobs" className="btn btn-ghost">
         <Image src="/jb.png" alt="AI Avatar" width={110} height={110} className="object-cover" />
        </Link>
        </div>
        <div className="flex-none gap-4 flex items-center">
          <div className="hidden sm:flex gap-4">
             
           <Link href="/" className="btn btn-ghost">
            <p>AI Mock Interview</p>
          </Link>

          <button className="btn btn-ghost" onClick={()=>{
            toast.info("AI Resume Builder is under development. Please check back later!", {
             duration: 2000,
              position: "top-center",
            }
            )
          }}>
            <p >AI Resume Builder</p>
          </button>
          </div>

        </div>
      </nav>

      {/* Main content area */}
<div
  className="bg-[url('/jobpattern.png')] bg-no-repeat bg-center bg-cover h-[652px] lg:h-[698px] relative pt-32 md:pt-40"
>
  <div className="container mx-auto px-5 sm:px-0">
    <div className="max-w-[640px] w-full mx-auto">
     <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold  text-center leading-tight max-w-[446px] w-full mx-auto">
      Your Ultimate Job Search Companion</h1>
      <p className="text-sm sm:text-base md:text-lg  text-center pt-4 mb-8">
        Are you looking for the perfect job or the ideal candidate? Find your
        dream job with thousands of job postings across industries.
      </p>

    <div className="flex justify-center">
  <button onClick={()=>{
     if (allJobs.length === 0) {
          
        } else if (allJobs.length > 0) {
         const jobDate = moment(allJobs[0].created_date).startOf('day'); 
         const today = moment().startOf('day');

          // Compare dates (ignores time)
          const isSameDay = jobDate.isSame(today, 'day');

          if (!isSameDay) {
          } else {
            toast.error("You have already searched for jobs today!", {
              duration: 2000,
              position: "top-center",
            });
          }
        }
    
   
    
    }} className="bg-primary cursor-pointer px-7 py-3 rounded-lg text-primary-content text-base font-medium flex items-center justify-center gap-3 flex-row-reverse hover:bg-primary-content hover:text-white">
    <svg className="w-5 h-5" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fillRule="evenodd" clipRule="evenodd" d="M3.85587 1.61739C5.19014 0.725854 6.75882 0.25 8.36354 0.25H8.36358C10.5154 0.250137 12.579 1.105 14.1006 2.62655C15.6221 4.14811 16.477 6.21174 16.4771 8.36355V8.36359C16.4771 9.96831 16.0013 11.537 15.1097 12.8713C14.9533 13.1054 14.7852 13.3305 14.6065 13.5459L19.5303 18.4697C19.8232 18.7626 19.8232 19.2374 19.5303 19.5303C19.2374 19.8232 18.7625 19.8232 18.4696 19.5303L13.5458 14.6065C12.9234 15.1232 12.2239 15.5467 11.4685 15.8596C9.98591 16.4737 8.35454 16.6344 6.78065 16.3213C5.20677 16.0082 3.76107 15.2355 2.62636 14.1008C1.49165 12.9661 0.718908 11.5204 0.405843 9.94648C0.0927783 8.37259 0.253454 6.74122 0.867553 5.25866C1.48165 3.77609 2.52159 2.50892 3.85587 1.61739ZM8.36349 1.75C7.05546 1.75001 5.77681 2.13789 4.68922 2.86459C3.60162 3.5913 2.75394 4.6242 2.25337 5.83268C1.75281 7.04116 1.62183 8.37093 1.87702 9.65384C2.13221 10.9368 2.76209 12.1152 3.68702 13.0401C4.61195 13.965 5.79038 14.5949 7.07329 14.8501C8.3562 15.1053 9.68597 14.9743 10.8945 14.4738C12.1029 13.9732 13.1358 13.1255 13.8625 12.0379C14.5892 10.9503 14.9771 9.67167 14.9771 8.36364M8.36354 1.75C10.1175 1.75012 11.7997 2.44695 13.0399 3.68721C14.2802 4.92748 14.977 6.60960 14.9771 8.36359" fill="currentColor" />
    </svg>
    <span className="text-2xl">Click here to find your dream jobs</span>
  </button> 
  
</div>
  <LastSearchInfo allJobs={allJobs} />
{/* Modal */}



{/* modal end */}
   {/* <form onSubmit={handleSubmit}>
        <div className="relative w-full">
          <svg className="hidden sm:block absolute left-4 md:left-8 top-5 md:top-7" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M3.85587 1.61739C5.19014 0.725854 6.75882 0.25 8.36354 0.25H8.36358C10.5154 0.250137 12.579 1.105 14.1006 2.62655C15.6221 4.14811 16.477 6.21174 16.4771 8.36355V8.36359C16.4771 9.96831 16.0013 11.537 15.1097 12.8713C14.9533 13.1054 14.7852 13.3305 14.6065 13.5459L19.5303 18.4697C19.8232 18.7626 19.8232 19.2374 19.5303 19.5303C19.2374 19.8232 18.7625 19.8232 18.4696 19.5303L13.5458 14.6065C12.9234 15.1232 12.2239 15.5467 11.4685 15.8596C9.98591 16.4737 8.35454 16.6344 6.78065 16.3213C5.20677 16.0082 3.76107 15.2355 2.62636 14.1008C1.49165 12.9661 0.718908 11.5204 0.405843 9.94648C0.0927783 8.37259 0.253454 6.74122 0.867553 5.25866C1.48165 3.77609 2.52159 2.50892 3.85587 1.61739ZM8.36349 1.75C7.05546 1.75001 5.77681 2.13789 4.68922 2.86459C3.60162 3.5913 2.75394 4.6242 2.25337 5.83268C1.75281 7.04116 1.62183 8.37093 1.87702 9.65384C2.13221 10.9368 2.76209 12.1152 3.68702 13.0401C4.61195 13.965 5.79038 14.5949 7.07329 14.8501C8.3562 15.1053 9.68597 14.9743 10.8945 14.4738C12.1029 13.9732 13.1358 13.1255 13.8625 12.0379C14.5892 10.9503 14.9771 9.67167 14.9771 8.36364M8.36354 1.75C10.1175 1.75012 11.7997 2.44695 13.0399 3.68721C14.2802 4.92748 14.977 6.60960 14.9771 8.36359" fill="currentColor"></path></svg>
          <input type="search" onChange={(e) => setPosition(e.target.value)} value={position} placeholder="Job Role" className="text-base-content bg-primary-content outline-none rounded-xl pl-4 sm:pl-12 md:pl-20 pr-28  h-[60px] md:h-[72px] w-full"/>
      <button type="submit" className="bg-primary px-5 py-3 rounded-lg text-primary-content text-base font-medium absolute right-1.5 md:right-3 top-1.5 md:top-3">
        Search
        
        </button>
      <svg className="hidden sm:block absolute left-4 md:left-8 top-5 md:top-7" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M3.85587 1.61739C5.19014 0.725854 6.75882 0.25 8.36354 0.25H8.36358C10.5154 0.250137 12.579 1.105 14.1006 2.62655C15.6221 4.14811 16.477 6.21174 16.4771 8.36355V8.36359C16.4771 9.96831 16.0013 11.537 15.1097 12.8713C14.9533 13.1054 14.7852 13.3305 14.6065 13.5459L19.5303 18.4697C19.8232 18.7626 19.8232 19.2374 19.5303 19.5303C19.2374 19.8232 18.7625 19.8232 18.4696 19.5303L13.5458 14.6065C12.9234 15.1232 12.2239 15.5467 11.4685 15.8596C9.98591 16.4737 8.35454 16.6344 6.78065 16.3213C5.20677 16.0082 3.76107 15.2355 2.62636 14.1008C1.49165 12.9661 0.718908 11.5204 0.405843 9.94648C0.0927783 8.37259 0.253454 6.74122 0.867553 5.25866C1.48165 3.77609 2.52159 2.50892 3.85587 1.61739ZM8.36349 1.75C7.05546 1.75001 5.77681 2.13789 4.68922 2.86459C3.60162 3.5913 2.75394 4.6242 2.25337 5.83268C1.75281 7.04116 1.62183 8.37093 1.87702 9.65384C2.13221 10.9368 2.76209 12.1152 3.68702 13.0401C4.61195 13.965 5.79038 14.5949 7.07329 14.8501C8.3562 15.1053 9.68597 14.9743 10.8945 14.4738C12.1029 13.9732 13.1358 13.1255 13.8625 12.0379C14.5892 10.9503 14.9771 9.67167 14.9771 8.36364M8.36354 1.75C10.1175 1.75012 11.7997 2.44695 13.0399 3.68721C14.2802 4.92748 14.977 6.60960 14.9771 8.36359" fill="currentColor"></path></svg>
      </div>
      </form> */}
    </div>
  </div>
</div>
{/* */}
<LogoCarousel size={size} />
{/* Job List main header */}
<JobListSection jobs={allJobs} />
<Footer />
    </div>
  );
}
