// jobs/page.tsx
"use client"; // Make this a client component

import JobListSection from "@/components/JobListSection";
import LogoCarousel from "@/components/LogoCarousel";

import React, { useState, useEffect, } from "react";
// Lottie and toast imports stay
import { toast } from "sonner";
import moment from "moment";
import LastSearchInfo from "@/components/LastSearchInfo";
import Footer from "@/components/Footer";

import { fetchAndProcessJobs, fetchUserDataAndJobs } from "@/lib/actions/jobs.action";
import Lottie, { LottieComponentProps } from "lottie-react";
import { getCurrentUser } from "@/lib/actions/auth.action";
import Header from "@/components/Header";



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
  const [theme, setTheme] = useState("night");
  const [loading, setLoading] = useState(true);
  const [allJobs, setAllJobs] = useState<Job[]>([]);
  const [animationData, setAnimationData] = useState<LottieComponentProps["animationData"] | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
    const [generateStatus, setGenerateStatus] =useState<boolean>(false);

    const [role, setRole] = useState("");
      const [city, setCity] = useState("");
      const [level, setLevel] = useState("Select Experience Level");
  // Move these useState calls to the top, before any early returns
   const [size, setSize] = useState(() => {
    if (typeof window !== "undefined") { // This is correct
      return getDeviceSize(window.innerWidth);
    }
    return "desktop";
  });
  // const [position, setPosition] = useState("");

  useEffect(() => {
    setIsFullscreen(false);

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
console.log("Setting theme:", theme);
  // Move this useEffect for theme to the top, before early return
 useEffect(() => {
  
  if (theme) {
    document.documentElement.setAttribute("data-theme", theme);
  }
}, [theme]);

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

  const getJobs = async () => {
     const currentUser = await getCurrentUser();
        const userId = currentUser?.id;

        if (!userId) {
          console.error("No user ID found.");
          return;
        }
       if (role.trim() === "") {
          toast.error("Please enter a role!", { duration: 2000, position: "top-center" });
          return;
        }
        if (level === "Select Experience Level") {
          toast.error("Please select an experience level!", { duration: 2000, position: "top-center" });
          return;
        }
        if (city.trim() === "") {
          toast.error("Please enter a city/preferred location!", { duration: 2000, position: "top-center" });
          return;
        }

        // Logic for checking if already searched today (client-side specific)
        if (allJobs.length > 0) {
          const jobDate = moment(allJobs[0].created_date).startOf("day");
          const today = moment().startOf("day");
          const isSameDay = jobDate.isSame(today, "day");
          if (isSameDay) {
            toast.error("You have already searched for jobs today!", { duration: 2000, position: "top-center" });
            return; // Stop the function here
          }
        }

        console.log("Searching... Please wait");
        setGenerateStatus(true); // Set loading status in the component
        const loadingToastId = toast.loading("Searching jobs for you... Please wait while it loads. Do not close this window.", {
          duration: 5000,
          id: "loading-toast",
        });

       
     const newJobs=await fetchAndProcessJobs({
      userId,
      role,
      city,
      level,
     });
     if(newJobs){
       toast.dismiss(loadingToastId);
    toast.success("Jobs fetched successfully!", {
      duration: 2000,
      position: "top-center",
    });
window.location.reload();
     }
      //  

  };
  // const handleSubmit = (e: React.FormEvent) => {
  //   e.preventDefault();
  //    getJobs();
  // };


  const closeModal = () => {
    setIsOpen(false);
  };



  const commonFieldClasses =
    "w-full px-5 py-3 pr-10 rounded-md border border-gray-300 dark:border-gray-700 bg-gray-900 text-white appearance-none";

  return (
    <div data-theme={theme} className="min-h-screen bg-base-100 text-base-content font-sans transition-colors duration-300">
      {/* header */}
     <Header theme={theme} setTheme={setTheme} />

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
           setIsOpen(true)
        } else if (allJobs.length > 0) {
         const jobDate = moment(allJobs[0].created_date).startOf('day'); 
         const today = moment().startOf('day');

          // Compare dates (ignores time)
          const isSameDay = jobDate.isSame(today, 'day');

          if (!isSameDay) {
            setIsOpen(true)
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
{isOpen && (
  <div className="fixed inset-0 flex items-center justify-center overflow-y-auto z-[99999]">
    {/* Backdrop */}
    {!isFullscreen && (
      <div
        className="fixed inset-0 h-full w-full bg-gray-400/20 backdrop-blur-[5px]"
        onClick={closeModal}
      ></div>
    )}

    {/* Modal Content */}
    <div
      className={`${
        isFullscreen ? "w-full h-full" : "relative w-full max-w-[700px] m-4 rounded-3xl bg-white dark:bg-gray-900"
      }`}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Close Button */}
      {true && (
        <button
          onClick={closeModal}
          className="absolute right-3 top-3 z-[999] flex h-9.5 w-9.5 items-center justify-center rounded-full bg-gray-100 text-gray-400 transition-colors hover:bg-gray-200 hover:text-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white sm:right-6 sm:top-6 sm:h-11 sm:w-11"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M6.04289 16.5413C5.65237 16.9318 5.65237 17.565 6.04289 17.9555C6.43342 18.346 7.06658 18.346 7.45711 17.9555L11.9987 13.4139L16.5408 17.956C16.9313 18.3466 17.5645 18.3466 17.955 17.956C18.3455 17.5655 18.3455 16.9323 17.955 16.5418L13.4129 11.9997L17.955 7.4576C18.3455 7.06707 18.3455 6.43391 17.955 6.04338C17.5645 5.65286 16.9313 5.65286 16.5408 6.04338L11.9987 10.5855L7.45711 6.0439C7.06658 5.65338 6.43342 5.65338 6.04289 6.0439C5.65237 6.43442 5.65237 7.06759 6.04289 7.45811L10.5845 11.9997L6.04289 16.5413Z"
              fill="currentColor"
            />
          </svg>
        </button>
      )}

      {/* Modal Inner Content */}
      <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
        <div className="px-2 pr-14">
          <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
            Find Your Dream Job!
          </h4>
          <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
            Update your details to keep your profile up-to-date.
          </p>
        </div>
        {/* Add your fields or form here */}
        <div className="flex flex-col gap-5">
        {/* role */}
        <div className="flex flex-col gap-2 w-full">
        <label className="text-white font-medium">Role</label>
        <input
            type="text"
            placeholder="e.g. Sales Executive, Software Engineer, etc."
            className={commonFieldClasses}
            value={role}
            onChange={(e) => setRole(e.target.value)}
            />
      </div>
            {/* Experience Level */}
      <div className="flex flex-col gap-2 w-full">
        <label className="text-white font-medium">Experience Level</label>
        <div className="relative">
        <select
            className={`${commonFieldClasses} pl-3 pr-10`}
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            >
            <option value="">Select Experience Level</option>
            <option>Entry level</option>
            <option>Mid level</option>
            <option>Senior level</option>
            <option>1 year</option>
            <option>2 years</option>
            <option>3 years</option>
            <option>4 years</option>
            <option>5 years</option>
            <option>6 years</option>
            <option>7 years</option>
            <option>8 years</option>
            <option>9 years</option>
            <option>10 years</option>
            <option>1 to 2 years</option>
            <option>2 to 3 years</option>
            <option>3 to 5 years</option>
            <option>5 to 10 years</option>
            <option>10 to 12 years</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center justify-center text-white">
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>
      {/* City */}
       <div className="flex flex-col gap-2 w-full">
        <label className="text-white font-medium">Preferred location</label>
        <input
            type="text"
            placeholder="e.g. Bangaluru."
            className={commonFieldClasses}
            value={city}
            onChange={(e) => setCity(e.target.value)}
            />
      </div>
      {/* Country */}
      <div className="flex flex-col gap-2 w-full ">
        <label className="text-white font-medium">Country</label>
        <input
            type="text"
            placeholder="India"
            className={`${commonFieldClasses} cursor-not-allowed`}
            value={"India"}
            disabled
            />
      </div>
      {/*  */}
       <button onClick={()=>{
       if (allJobs.length === 0) {
          getJobs();
        } else if (allJobs.length > 0) {
          const jobDate = moment(allJobs[0].created_date).startOf('day');
          const today = moment().startOf('day');

          // Compare dates (ignores time)
          const isSameDay = jobDate.isSame(today, 'day');

          if (!isSameDay) {
            getJobs(); // allow only if it's a new day
          } else {
            toast.error("You have already searched for jobs today!", {
              duration: 2000,
              position: "top-center",
            });
          }
        }
        }} className="cursor-pointer px-10 bg-primary-200 text-accent-content text-xl font-medium py-3 rounded-md mt-4 transition hover:bg-primary hover:text-primary-content">
      {generateStatus? <span className="dots-loading">. . .</span> : "Search Jobs"}
      </button>
      {/*  */}
      </div>
      </div>
    </div>
  </div>
)}



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
