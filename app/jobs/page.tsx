// jobs/page.tsx
"use client"; // Make this a client component

import JobListSection from "@/components/JobListSection";
import LogoCarousel from "@/components/LogoCarousel";

import React, { useState, useEffect, useRef } from "react";
// Lottie and toast imports stay
import { toast } from "sonner";
import moment from "moment";
import LastSearchInfo from "@/components/LastSearchInfo";
import Footer from "@/components/Footer";

import { fetchAndProcessJobs, fetchUserDataAndJobs } from "@/lib/actions/jobs.action";
import { getCurrentUser } from "@/lib/actions/auth.action";
import Link from "next/link";
import Image from "next/image";

const themes = [
  "night",
  "synthwave",
  "halloween",
  "forest",
  "aqua",
  "dracula",
];

/**
 * ThemeSwitcher Component
 * Renders a dropdown menu to select a theme, with visual previews.
 */
interface ThemeSwitcherProps {
  theme: string;
  setTheme: (theme: string) => void;
}

function ThemeSwitcher({ theme, setTheme }: ThemeSwitcherProps) {
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const [open, setOpen] = useState(false);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);


  // Icon component
  const ThemeIcon = () => (
    <svg
      className="cursor-pointer"
      width="22"
      height="22"
      viewBox="0 0 22 22"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M19.4234 14.5625C19.3437 14.4734 19.2734 14.3937 19.2218 14.3328C19.0625 14.1453 18.8421 14.0281 18.5984 14.0047C18.35 13.9812 18.1062 14.0515 17.914 14.2109C17.8671 14.2484 17.825 14.2906 17.7875 14.3375C17.7312 14.4031 17.6562 14.4875 17.5671 14.5859C16.8453 15.3922 15.5 16.9015 15.5 18.4625C15.5 20.1406 16.8453 21.5047 18.5 21.5047C20.1546 21.5047 21.5 20.1406 21.5 18.4625C21.5 16.8875 20.15 15.3734 19.4234 14.5625ZM18.5 20C17.675 20 17 19.3062 17 18.4578C17 17.5672 17.9187 16.4515 18.5046 15.7859C19.0906 16.4515 20 17.5672 20 18.4578C20 19.3062 19.325 20 18.5 20Z"></path>
      <path d="M16.9109 13.7703H16.925C17.2062 13.7703 17.4734 13.6625 17.6703 13.4609C17.8718 13.2594 17.9796 12.9969 17.9796 12.7156C17.9796 12.4344 17.8671 12.1578 17.6656 11.9609L6.82339 1.2078C5.87651 0.256237 4.32964 0.251549 3.37808 1.20311L3.13433 1.44686C2.18277 2.39374 2.17808 3.94061 3.12964 4.89217L5.07964 6.84218L1.10933 10.8078C0.720265 11.1969 0.50464 11.7125 0.499953 12.2656C0.495265 12.8187 0.71089 13.3344 1.09995 13.7234C1.10933 13.7328 1.1187 13.7422 1.13277 13.7562L7.28277 19.6625C7.68589 20.0469 8.19683 20.239 8.71245 20.239C9.22808 20.239 9.74839 20.0422 10.1468 19.6578L10.8078 19.0203C12.7625 17.1312 15.7062 14.2812 16.0906 13.8969C16.114 13.8734 16.3062 13.7703 16.9109 13.7703ZM4.18901 3.83749C3.82339 3.46717 3.82339 2.87655 4.18901 2.51092L4.43277 2.26717C4.79839 1.90155 5.3937 1.90155 5.75933 2.27186L7.71402 4.21249L6.13433 5.79217L4.18901 3.83749ZM15.0359 12.8234C14.689 13.1703 11.6093 16.1515 9.76714 17.9375L9.1062 18.575C8.88589 18.7859 8.5437 18.7859 8.32339 18.5797L2.17339 12.6734L2.16402 12.6641C2.0562 12.5562 1.99995 12.4156 1.99995 12.2656C1.99995 12.1156 2.06089 11.975 2.1687 11.8672L6.13902 7.90624L8.78277 5.26249L15.9406 12.3641C15.5562 12.4531 15.2562 12.6031 15.0359 12.8234Z"></path>
    </svg>
  );




  return (
    <div className="dropdown dropdown-end relative" ref={dropdownRef}>
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Theme switcher"
        className="btn btn-ghost btn-circle"
        onClick={() => setOpen((o) => !o)}
      >
        <ThemeIcon />
      </button>
      {open && (
        <ul
          role="menu"
          className="dropdown-content grid p-3 shadow-lg mt-5 bg-base-200 rounded-lg w-52 max-h-80 overflow-y-auto z-50"
        >
          {themes.map((t) => (
            <li
              key={t}
              role="menuitem"
              tabIndex={0}
              className="capitalize w-full flex mb-2 rounded-md last-of-type:mb-0 justify-between items-center px-2 py-2 hover:bg-base-300 transition-all duration-300 cursor-pointer"
              onClick={() => {
                setTheme(t);
                setOpen(false);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  setTheme(t);
                  setOpen(false);
                }
              }}
              data-theme={t}
            >
              <span className="text-base-content flex items-center gap-2 select-none">
                {theme === t && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-3 h-3 text-primary"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <path d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z"></path>
                  </svg>
                )}
                {t=="night" ? "lofi" : t}
              </span>
              <div className="flex flex-shrink-0 flex-wrap gap-1 h-full">
                <div className="bg-primary w-2 h-4 rounded"></div>
                <div className="bg-secondary w-2 h-4 rounded"></div>
                <div className="bg-accent w-2 h-4 rounded"></div>
                <div className="bg-neutral w-2 h-4 rounded"></div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

type DeviceSize = "mobile" | "medium" | "desktop";

function getDeviceSize(width: number): DeviceSize {
  if (width < 768) return "mobile";      // Tailwind: < md
  if (width < 1024) return "medium";     // Tailwind: < lg
  return "desktop";                      // Tailwind: lg and up
};
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
export default function JobsApp() {
  // Initialize theme from localStorage or default to "night"
  const [theme, setThemeState] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("theme") || "night";
    }
    return "night";
  });

  // Function to set theme and save to localStorage
  const setTheme = (newTheme: string) => {
    setThemeState(newTheme);
    if (typeof window !== "undefined") {
      localStorage.setItem("theme", newTheme);
    }
  };
 const [loading, setLoading] = useState(true);
  const [allJobs, setAllJobs] = useState<Job[]>([]);
 const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
    const [generateStatus, setGenerateStatus] =useState<boolean>(false);
   const [photoUrl, setPhotoUrl] = useState<string>("");
   const [username, setUsername] = useState<string>("");
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
    
      // Fetch user data and jobs

      const currentUser = await getCurrentUser();
      setPhotoUrl(currentUser?.photoURL || "/user-avatar.jpg");
      setUsername(currentUser?.name || "Hey");
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
 if (loading) {
  return (
    <div className="fixed inset-0 z-50  text-white flex items-center justify-center">
      <div role="status" className="text-center">
        <svg
          aria-hidden="true"
          className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
          viewBox="0 0 100 101"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
            fill="currentColor"
          />
          <path
            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
            fill="currentFill"
          />
        </svg>
        <span className="ml-5 text-xl text-amber-50">Loading...</span>
      </div>
    </div>
  );
}



  const getJobs = async () => {
    
       if (role.trim() === "") {
          toast.error("Please enter a role!", { duration: 2000, position: "top-center",closeButton:true });
          return;
        }
        if (level === "Select Experience Level") {
          toast.error("Please select an experience level!", { duration: 2000, position: "top-center" ,closeButton:true });
          return;
        }
        if (city.trim() === "") {
          toast.error("Please enter a city/preferred location!", { duration: 2000, position: "top-center" ,closeButton:true });
          return;
        }

        // Logic for checking if already searched today (client-side specific)
        if (allJobs.length>0) {
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

        const currentUser = await getCurrentUser();
        const userId = currentUser?.id;

        if (userId) {
         
     const newJobs=await fetchAndProcessJobs({
      userId,
      role,
      city,
      level,
     });
     console.log(newJobs);
     if(newJobs){
       toast.dismiss(loadingToastId);
       
    toast.success("Jobs fetched successfully!", {
      duration: 2000,
      position: "top-center",
    });
    setTimeout(()=>{
     window.location.reload();
    },1000)
  }else{
  
            toast.error("You have already searched for jobs today!", { duration: 2000, position: "top-center" });
          
  }
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
      <nav className="navbar px-4 sm:px-20" role="navigation" aria-label="Main navigation">
        <div className="flex-1 flex items-center">
         {/* nextjs image */}
         <Link href="/jobs" className="btn btn-ghost">
         <Image src="/jb.png" alt="AI Avatar" width={110} height={110} className="object-cover" />
        </Link>
        </div>
        <div className="flex-none gap-4 flex items-center">
          <div className="flex gap-4">
             <ThemeSwitcher theme={theme} setTheme={setTheme} />
           <Link href="/" className="hidden sm:btn btn-ghost">
            <p>AI Mock Interview</p>
          </Link>
 <Link href="/jobs/resume-checker" className="hidden sm:btn btn-ghost">
            <p>ATS Resume Checker</p>
          </Link>
          <button className="hidden sm:btn btn-ghost" onClick={()=>{
            toast.info("AI Resume Builder is under development. Please check back later!", {
             duration: 2000,
              position:"top-right",
            
            }
            )
          }}>
             
            <p >AI Resume Builder</p>
          
          </button>
          
        
            <p className="hidden sm:btn btn-md">{username.split(" ")[0]}</p>
          
          
          <Link href={"/profile"} className="p-1 rounded-full border-1 border-white hover:ring-2 ring-white transition duration-200">
                    <Image
                            src={photoUrl}
                            alt="avatar"
                            width={32}
                            height={32}
                            className="rounded-full"
                        />
                  </Link>
          </div>

        </div>
      </nav>
{/*  */}
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
   <span className="text-base md:text-2xl">
  Click here to find your dream jobs
</span>

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
        // onClick={closeModal}
      ></div>
    )}

    {/* Modal Content */}
    <div
      className={`${
        isFullscreen ? "w-full h-full" : "relative w-full max-w-[700px] m-4 rounded-3xl bg-white dark:bg-gray-900"
      }`}
      // onClick={(e) => e.stopPropagation()}
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
       if (allJobs.length>0) {
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
        } else {
         getJobs();
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
