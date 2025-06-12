"use client"; // Make this a client component
import Lottie, { LottieComponentProps } from 'lottie-react';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner';

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

// interface ApplyOption {
//   is_direct: boolean;
//   publisher: string;
//   apply_link: string;
// }

// interface Job {
//   id: number;
//   job_id: string;
//   search_data: string;
//   job_title: string;
//   employer_name: string;
//   employer_logo: string;
//   employer_website: string | null;
//   job_publisher: string;
//   job_employment_type: string;
//   job_employment_types: string[];
//   job_apply_link: string;
//   job_apply_is_direct: boolean;
//   apply_options: ApplyOption[];
//   job_description: string;
//   job_is_remote: boolean;
//   job_posted_at: string;
//   job_posted_at_timestamp: number;
//   job_posted_at_datetime_utc: string;
//   job_location: string;
//   job_city: string;
//   job_state: string;
//   job_country: string;
//   job_latitude: number;
//   job_longitude: number;
//   job_benefits: string | null;
//   job_google_link: string;
//   job_salary: number | null;
//   job_min_salary: number | null;
//   job_max_salary: number | null;
//   job_salary_period: string | null;
//   job_highlights: string | null;
//   job_onet_soc: number;
//   job_onet_job_zone: number;
//   candidate_id: string;
//   created_date: string;
// }
export default function JobsApp() {
   const [theme, setTheme] = useState("night");
     const [loading, setLoading] = useState(true);
  const [animationData, setAnimationData] = useState<LottieComponentProps["animationData"] | null>(null);
  
   
  // const [position, setPosition] = useState("");

  useEffect(() => {

    const initializeAppData = async () => {
      // Load Lottie animation data
      const res = await fetch("/loaders/dataloader.json");
       const json = await res.json();
      setAnimationData(json);
      // Set initial theme from localStorage or default to "night"

      // Fetch user data and jobs

      // const currentUser = await getCurrentUser();
      //   const userId = currentUser?.id;

      //   if (!userId) {
      //     console.error("No user ID found.");
      //     return;
      //   }
      
        // const alldata = await fetchUserDataAndJobs({ userId });
        // console.log("Fetched jobs:", alldata);
        // setAllJobs(alldata);
        setLoading(false);
        console.log(loading)
      
    };

    initializeAppData();
  }, []);
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
          <div className="hidden sm:flex gap-4">
             <ThemeSwitcher theme={theme} setTheme={setTheme} />
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
{/*  */}

    </div>
  )
}
