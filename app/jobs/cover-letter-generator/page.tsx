"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  Lock,
  Upload,
  ArrowLeft,
  Star,
  ArrowLeftIcon,
  LucideCopy,
} from "lucide-react";
import {
  ArrowRightIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  StarIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { getCurrentUser } from "@/lib/actions/auth.action";
import { text } from "stream/consumers";
import EmblaCarousel from "@/components/EmblaCarousel";
import { useRouter } from "next/navigation";

const themes = ["night", "synthwave", "halloween", "forest", "aqua", "dracula"];

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
                {t == "night" ? "lofi" : t}
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
export default function CoverLetter() {
  const router = useRouter();
  const [coverLetter, setCoverLetter] = useState(`[Your Name]
[Street Address]
[City and Zip Code]
[Your Phone Number]

[Today’s Date]

[Addressee’s/Hiring Manager’s Name]
[Job Title]
[Organization/Company Name]
[Street Address]
[City and Zip Code]

Dear [Name],

I am writing to you to express my motivation for the currently open role as [OPEN ROLE] at [COMPANY YOU ARE APPLYING AT], which I believe can bring tremendous value for. 

For the past [YEARS OF EXPERIENCE] I’ve been focusing on [SKILL]. In addition, my academic background is in [RELEVANT ACADEMIC BACKGROUND]. Apart from being able to apply a diverse perspective, I add to the equation my skills at [SOFT/HARD SKILL], [SOFT/HARD SKILL], [SOFT/HARD SKILL].

I would love to schedule an interview with you and further discuss the possibility of the current role, as well as to understand the company's needs better. 
Thank you for your time and consideration.

Best regards,
[Your Name]`);

  const handleCopy = () => {
    navigator.clipboard.writeText(coverLetter).then(() => {
      toast.info("copied!", {
        position: "top-right",
        duration: 1000,
      });
    });
  };
  const [photoUrl, setPhotoUrl] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [userloading, setUserLoader] = useState(true);
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
  useEffect(() => {
    const initializeAppData = async () => {
      // Fetch user data and jobs

      const currentUser = await getCurrentUser();
      setPhotoUrl(currentUser?.photoURL || "/user-avatar.jpg");
      setUsername(currentUser?.name || "Hey");

      setUserLoader(false);
    };
    initializeAppData();
  }, []);
  if (userloading) {
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

  return (
    <>
      <div
        data-theme={theme}
        className="bg-base-100 text-base-content font-sans transition-colors duration-300"
      >
        {/* Header */}

        <nav
          className="navbar bg-transparent px-4 sm:px-20"
          role="navigation"
          aria-label="Main navigation"
        >
          <div className="flex-1 flex items-center">
            <a
              href="https://winyourinterview.ai/"
              target="_blank"
              className="btn btn-ghost"
            >
              <Image
                src="/wyi.png"
                alt="Company Logo"
                width={200}
                height={100}
                className="object-contain bg-gray-50 rounded-sm shadow-lg shadow-gray-700"
              />
            </a>
          </div>
          <div className="flex-none gap-4 flex items-center">
            <div className="flex gap-4">
              <ThemeSwitcher theme={theme} setTheme={setTheme} />
              <a
                href="https://app.winyourinterview.ai"
                target="_blank"
                className="hidden md:btn btn-ghost"
              >
                <p>AI Mock Interview</p>
              </a>
              <a
                href="https://app.winyourinterview.ai/jobs"
                target="_blank"
                className="hidden md:btn btn-ghost"
              >
                <p>Find Jobs</p>
              </a>
              <a
                href="https://app.winyourinterview.ai/jobs/resume-checker"
                target="_blank"
                className="hidden md:btn btn-ghost"
              >
                <p>ATS Resume Checker</p>
              </a>
              <p className="hidden sm:btn btn-md">{username.split(" ")[0]}</p>
              <Link
                href={"/profile"}
                className="block p-1 rounded-full border-1 border-white hover:ring-2 ring-white transition duration-200"
              >
                <Image
                  src={photoUrl || "/user-avatar.jpg"}
                  alt="avatar"
                  width={32}
                  height={32}
                  className="rounded-full"
                />
              </Link>
            </div>
          </div>
        </nav>
      </div>
      {/*  */}
      <div className="bg-white min-h-screen relative overflow-x-hidden">
        <div className="max-w-7xl mx-auto px-6 pt-20 pb-5 flex flex-col lg:flex-row items-start gap-16 lg:gap-24">
          <div className="flex flex-col max-w-xl w-full">
            <span className="text-indigo-600 font-semibold text-lg leading-5 tracking-wide mb-4">
              COVER LETTER GENERATOR
            </span>
            <h1 className="text-[#2d3639] font-extrabold text-5xl leading-[3.5rem] mb-6 font-mona-sans">
              Generate a tailored, job-winning cover letter in moments
            </h1>
            <div
              style={{ marginTop: "50px" }}
              className="flex gap-3 gap-4-xsm p-inline-4-xs p-inline-6-sm"
            >
              <button
                onClick={() => {
                  router.push("/jobs/cover-letter-generator/nextai");
                }}
                style={{
                  fontFamily: "Rubik, Open Sans, sans-serif",
                }}
                className="text-[18px] leading-[24px] py-[13px] px-5  text-[#fbe7ea] bg-[#b33443] 
    border-none font-[Rubik,'Open Sans',sans-serif] font-medium
    cursor-pointer flex justify-center items-center
    rounded text-center no-underline whitespace-nowrap align-middle
    h-fit transition-all duration-300 ease-in-out
    col-12-xsm full-width-xsm hover:bg-[#ffc6cd] hover:text-[#db4456] 
  "
                data-amplitude-event="homepage - sign up"
                data-amplitude-prop-button_location="Fold"
              >
                Build My Cover Letter Now
              </button>
            </div>
            <p className="text-violet-500 mt-5 text-lg">
              Create a customized cover letter that showcases your strengths and
              matches the role, helping you shine among applicants.
            </p>
          </div>

          <div className="flex-1 max-w-4xl w-full rounded-3xl overflow-hidden shadow-lg bg-white/90 backdrop-blur-sm border border-white/50">
            <img
              src="/cletters.png"
              alt="Resume checker dashboard"
              className="w-full h-auto object-contain"
              width={900}
              height={500}
            />
          </div>
        </div>
        {/*  */}
        {/* Main Content */}
        <div className="bg-[#e3e9f5] py-10 relative">
          <div className="container mx-auto flex flex-col md:flex-row justify-between gap-6">
            {/* Left Section */}
            <div className="w-full md:w-1/3 flex flex-col ">
              <h3
                className="font-bold text-2xl text-gray-900"
                style={{ fontSize: "40px" }}
              >
                Simple & Ready-to-Use Cover Letter Template
              </h3>
              <p className="mt-4 text-gray-700 leading-relaxed">
                Our career counselors have created a simple, ready-to-use cover
                letter template. Just copy, paste, and replace the bracketed
                sections with your own details
              </p>
              <img
                alt=""
                src="/carrow.png"
                className="hidden md:block w-full h-auto mt-6"
              />
            </div>

            {/* Right Section */}
            <div className="w-full md:w-2/3">
              <div className="relative">
                <textarea
                  className="w-full aspect-[704/764] text-[#384347] bg-[#f5f7fc] rounded-[10px] border-0 p-[46px_64px]  leading-[22.5px] resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  style={{ fontSize: "15px" }}
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                />
                <button
                  onClick={handleCopy}
                  title="Copy"
                  className="absolute cursor-pointer top-3 right-3 p-2 rounded bg-gray-100 hover:bg-gray-200 transition"
                >
                  <LucideCopy
                    style={{ color: "#000", height: "20px", width: "20px" }}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* Second Feature Section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 py-12 px-6 md:px-16 lg:px-24">
          {/* Left side image */}
          <div className="flex-1 flex">
            <img
              src="/rb/resumepack.png"
              alt="Resume checker dashboard"
              className="w-full max-w-md h-auto object-contain rounded-xl shadow"
              width={400}
              height={300}
            />
          </div>
          {/* Right side paragraph */}
          <div className="flex-1 max-w-xl">
            <div>
              <div>
                <h3
                  className="h3 font-mona-sans"
                  style={{
                    fontWeight: 500,
                    fontSize: 38,
                    lineHeight: "46px",
                    marginTop: 32,
                    marginBottom: 16,
                    color: "#2d3639",
                  }}
                >
                  Feature-Packed & ATS-Optimized Resume Builder
                </h3>
                <p
                  style={{
                    lineHeight: 1.6,
                    color: "#384347",
                    margin: "0 0 8px",
                    fontSize: 16,
                  }}
                >
                  Easily create and customize your ATS-optimized resume with our
                  intuitive drag-and-drop builder. Choose from professional
                  templates, section layouts, and design options tailored to
                  help you land more interviews.
                </p>
                <a
                  href="https://app.winyourinterview.ai/jobs/resume-builder"
                  target="_blank"
                >
                  <span
                    style={{
                      textDecoration: "underline",
                      fontSize: "16px",
                      fontWeight: 650,
                      cursor: "pointer",
                      color: "#5f4dc7",
                      lineHeight: "22px",
                    }}
                  >
                    Build Your Resume
                  </span>
                  <ArrowRightIcon className="text-[#5f4dc7] ml-1 w-4 h-4 inline-block" />
                </a>
              </div>
            </div>
          </div>
        </div>
        {/*  */}

        {/* Features Section */}
        <div style={{ background: "#fff", width: "100%" }}>
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 py-12 px-6 md:px-16 lg:px-24">
            {/* Left side paragraph */}
            <div className="flex-1 max-w-xl">
              <div>
                <div>
                  <h3
                    className="h3 font-mona-sans"
                    style={{
                      fontWeight: 500,
                      fontSize: 38,
                      lineHeight: "46px",
                      marginTop: 32,
                      marginBottom: 16,
                      color: "#2d3639",
                    }}
                  >
                    Boost Your Resume with 250+ Precision Checks
                  </h3>
                  <p
                    style={{
                      lineHeight: 1.6,
                      color: "#384347",
                      margin: "0 0 8px",
                      fontSize: 16,
                    }}
                  >
                    Let our AI analyze your resume with over 250 in-depth checks
                    — covering layout, wording, keywords, and more. Instantly
                    get personalized, actionable feedback to improve your
                    chances of getting hired.
                  </p>
                  <a
                    href="https://app.winyourinterview.ai/jobs/resume-checker"
                    target="_blank"
                    className="lbDsKPVYdwKjE90OIGvw8g== RRxe1M+sUxFTRkUeo96NlQ=="
                  >
                    <span
                      style={{
                        textDecoration: "underline",
                        fontSize: "16px",
                        fontWeight: 650,
                        cursor: "pointer",
                        color: "#5f4dc7",
                        lineHeight: "22px",
                      }}
                    >
                      Get Your Resume Score
                    </span>
                    <ArrowRightIcon className="text-[#5f4dc7] ml-1 w-4 h-4 inline-block" />
                  </a>
                </div>
              </div>
            </div>
            {/* Right side image */}
            <div className="flex-1 flex justify-end">
              <img
                src="/rb/resume.png"
                alt="Resume checker dashboard"
                className="w-full max-w-md h-auto object-contain rounded-xl shadow"
                width={400}
                height={300}
              />
            </div>
          </div>
        </div>
        {/*  */}
      </div>
    </>
  );
}
