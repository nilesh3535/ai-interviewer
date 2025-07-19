"use client";
import Footer from "@/components/Footer";
import { fetchJobDetails } from "@/lib/actions/jobs.action";
import moment from "moment";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
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

interface JobProps {
  searchParams: { jid?: string; rq?: string; cd?: string };
}

interface ApplyOption {
  is_direct: boolean;
  publisher: string;
  apply_link: string;
}

interface Job {
  id: number;
  job_id: string;
  job_title: string;
  search_data: string;
  employer_name: string|null;
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
// 

export default function JobDetails({  }: JobProps) {

  const [jobDetails, setJobDetails] =  useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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
const params = useParams();
   // Resolve searchParams promise
useEffect(() => {
  const idValue = Array.isArray(params.id) ? params.id[0] : params.id;
  const jobId = idValue?.split("details")[0];

  if (jobId) {
    fetchJobDetails({
      jobId,
      onSuccess: (jobs) => {
        setJobDetails(jobs);
      },
      onError: (errorMessage) => {
        setError(errorMessage);
      },
      onLoadingChange: setLoading,
    });
  } else {
    setLoading(false);
    setError("No job ID provided.");
  }
}, [params]);





  if (loading) {
    return <div>Loading please wait...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
   <div data-theme={theme} className="min-h-screen bg-base-100 text-base-content font-sans transition-colors duration-300">
      {/* header */}
      <nav className="navbar bg-transparent px-4 sm:px-20" role="navigation" aria-label="Main navigation">
       <div className="flex-1 flex items-center">
                {/* nextjs image */}
                <a href="https://winyourinterview.ai/" target='_blank' className="btn btn-ghost">
                 <Image
                                    src="/wyi.png" // replace with your logo path
                                    alt="Company Logo"
                                    width={200}
                                    height={100}
                                    className="object-contain bg-gray-50 rounded-sm shadow-lg shadow-gray-700"
                                  />
                        </a>
              
               </div>
        <div className="flex-none gap-4 flex items-center">
          <div className="hidden sm:flex gap-4">
             <ThemeSwitcher theme={theme} setTheme={setTheme} />
           <Link href="/" className="btn btn-ghost">
            <p>AI Mock Interview</p>
          </Link>

         <Link href="/jobs/resume-checker" className="hidden sm:btn btn-ghost">
            <p>ATS Resume Checker</p>
          </Link>
          </div>

        </div>
      </nav>
{/*  */}
<div
  className="bg-[url('/jobpattern.png')] bg-no-repeat bg-center bg-cover h-[250px] relative z-[1]"
></div>

{/*  */}
    <div className="w-full bg-gray-100">
    <div className="container  mx-auto px-5 md:px-0  relative z-[2] pb-30 ">
      <div className="grid grid-cols-12 lg:gap-8 justify-items-center w-full">
        <div className="col-span-12 lg:w-10/12 xl:w-full xl:col-span-8">
          {/* Main Card */}
          <div className="p-8 bg-white rounded-t-2xl -mt-[184px]">
            <Link
          href={"/jobs"}
          className="cursor-pointer bg-base-content/20 px-3 py-2.5 text-sm font-medium text-accent-content/60 rounded-lg flex items-center gap-2.5 hover:bg-accent-content hover:text-white transition hover:duration-500 w-fit"
        >
  <span>
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M5.13591 0.598461C4.87963 0.34218 4.46412 0.34218 4.20784 0.598461L0.270336 4.53596C0.0140553 4.79224 0.0140553 5.20776 0.270336 5.46404L4.20784 9.40154C4.46412 9.65782 4.87963 9.65782 5.13591 9.40154C5.3922 9.14526 5.3922 8.72974 5.13591 8.47346L2.3187 5.65625H9.26562C9.62806 5.65625 9.92188 5.36244 9.92188 5C9.92188 4.63756 9.62806 4.34375 9.26562 4.34375H2.3187L5.13591 1.52654C5.3922 1.27026 5.3922 0.854743 5.13591 0.598461Z"
        fill="currentColor"
      />
    </svg>
  </span>
  Back
</Link>


            <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mt-6 pb-6 xl:border-b border-accent-content/10">
             {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={jobDetails[0].employer_logo || "/jobimg.png"}
                  onError={(e) => {
                    e.currentTarget.src = "/jobimg.png"; // fallback image
                  }}
                  alt="company logo"
                  loading="lazy"
                  width={50}
                  height={50}
                  className="p-2 bg-accent-content rounded-xl"
                  decoding="async"
                  data-nimg="1"
                  style={{ color: "transparent" }}
                />
                              <div>
                <p className="text-base font-medium text-accent"> {jobDetails[0].employer_name}</p>
                <h6 className="mt-1 text-3xl font-medium text-accent-content">
                {jobDetails[0].job_title}
                </h6>
              </div>
            </div>

            <div className="block xl:hidden">
              <div className="rounded-xl">
                <Link target="_blank"  href={`${jobDetails[0].job_apply_link}`} className="bg-primary w-fit  py-3 px-5 text-base font-semibold text-primary-content rounded-lg flex items-center gap-3 hover:bg-accent-content hover:text-white transition hover:duration-500">
                  Apply Now
                  <span>
                    <svg className="text-xl" width="18" height="18" viewBox="0 0 14 14" fill="none">
                      {/* SVG path same as original */}
                    </svg>
                  </span>
                </Link>
                <div className="mt-3">
                  {[
                    ["Date Posted", moment(jobDetails[0].job_posted_at_datetime_utc).format('MMM DD, YYYY')],
                    ["Job Type", jobDetails[0].job_employment_type],
                    ["Job Role", jobDetails[0].job_title],
                    ["Salary", `${jobDetails[0].job_min_salary || ""} - ${jobDetails[0].job_max_salary || ""}`],
                   ["Tag", jobDetails[0].search_data],
                  ].map(([label, value]) => (
                    <div
                      key={label}
                      className="flex items-center justify-between py-5 border-b border-accent-content/10"
                    >
                      <p className="text-base text-accent">{label}</p>
                      <p className="text-base text-accent-content font-medium">{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Description Section */}
          <div className="bg-white p-8 pt-0 border-b rounded-b-2xl border-base-content/10">
            <h5 className="text-2xl font-bold  text-accent-content">Description</h5>

            <h6 className="mt-8 text-xl font-bold text-accent-content">Overview</h6>
          <pre className="font-sans text-lg text-accent-content/80 whitespace-pre-wrap">
          {jobDetails[0].job_description}  
        </pre>

          </div>

          {/* CTA Footer */}
          <div className="mt-8 flex flex-col md:flex-row items-center gap-5 md:gap-0 justify-center md:justify-between">
            <div>
              <h6 className="text-xl font-semibold text-accent">Interested in this job?</h6>
          
            </div>
            <Link target="_blank" href={`${jobDetails[0].job_apply_link}`} className="bg-primary w-fit hover:transition py-3 px-5 text-base font-semibold text-primary-content rounded-lg flex items-center gap-3 hover:text-white transition hover:duration-500 hover:bg-accent-content">
              Apply Now
              <span>
                <svg className="text-xl" width="18" height="18" viewBox="0 0 14 14" fill="none">
                  {/* same path */}
                </svg>
              </span>
            </Link>
          </div>
         
        </div>

        {/* Sidebar */}
        <div className="hidden xl:block xl:col-span-4">
          <div className="p-8 bg-white rounded-xl -mt-[184px]">
            <Link target="_blank" href={`${jobDetails[0].job_apply_link}`} className="bg-primary w-full hover:bg-primary-focus transition hover:duration-500 py-3 px-5 text-base font-semibold text-primary-content rounded-lg flex items-center justify-end hover:bg-accent-content hover:text-white">
              <span className="mr-12">Apply for this position</span>
              <span>
                <svg className="text-xl" width="18" height="18" viewBox="0 0 14 14" fill="none">
                  {/* same icon */}
                </svg>
              </span>
            </Link>
            <div className="mt-3">
              {[
                    ["Date Posted", moment(jobDetails[0].job_posted_at_datetime_utc).format('MMM DD, YYYY')],
                    ["Job Type", jobDetails[0].job_employment_type],
                    ["Job Role", jobDetails[0].job_title],
                    ["Salary", `${jobDetails[0].job_min_salary || ""} - ${jobDetails[0].job_max_salary || ""}`],
                  ["Tag", jobDetails[0].search_data],
                ].map(([label, value]) => (
                <div
                  key={label}
                  className="flex items-center justify-between py-5 border-b border-accent-content/10"
                >
                 <p className="text-base text-accent">{label}</p>
                      <p className="text-base text-accent-content font-medium">{value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 px-12">
            <div className="bg-base-300/30 rounded-xl text-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
             <img
                src={"/jobad.png"}
                onError={(e) => {
                  e.currentTarget.src = "/jobad.png"; // fallback image
                }}
                alt="Get your dream jobs - powered by WinYourInterview"
                loading="lazy"
                width={300}
                height={360}
                className="p-1 bg-primary rounded-xl"
                decoding="async"
                style={{ color: "transparent" }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  <Footer />
    </div>
  );
}