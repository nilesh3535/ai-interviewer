"use client";
import React, { useState, useEffect, useRef } from "react";
import { Lock, Upload, ArrowLeft, ArrowRightIcon } from "lucide-react";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { getCurrentUser } from "@/lib/actions/auth.action";
import { useReactToPrint } from "react-to-print";
import jsPDF from "jspdf";

import {
  Roboto,
  Lato,
  Montserrat,
  Open_Sans,
  Raleway,
  Noto_Serif,
  Lora,
  Roboto_Slab,
  Playfair_Display,
  Merriweather,
} from "next/font/google";

// 2️⃣ Top-level font definitions
const roboto = Roboto({ subsets: ["latin"], weight: ["400", "700"] });
const lato = Lato({ subsets: ["latin"], weight: ["400", "700"] });
const montserrat = Montserrat({ subsets: ["latin"], weight: ["400", "700"] });
const openSans = Open_Sans({ subsets: ["latin"], weight: ["400", "700"] });
const raleway = Raleway({ subsets: ["latin"], weight: ["400", "700"] });
const notoSerif = Noto_Serif({ subsets: ["latin"], weight: ["400", "700"] });
const lora = Lora({ subsets: ["latin"], weight: ["400", "700"] });
const robotoSlab = Roboto_Slab({ subsets: ["latin"], weight: ["400", "700"] });
const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "700"],
});
const merriweather = Merriweather({
  subsets: ["latin"],
  weight: ["400", "700"],
});

// 3️⃣ Font map
const fontMap = {
  Roboto: roboto.className,
  Lato: lato.className,
  Montserrat: montserrat.className,
  "Open Sans": openSans.className,
  Raleway: raleway.className,
  "Noto Serif": notoSerif.className,
  Lora: lora.className,
  "Roboto Slab": robotoSlab.className,
  "Playfair Display": playfairDisplay.className,
  Merriweather: merriweather.className,
};
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
interface ResumeAnalysis {
  verdict: string;
  reason: string;
  tips: string[];
  overallScore: number;
  issueCount: number;
  scoreBreakdown: {
    tailoring: number;
    content: number;
    sections: number;
    style: number;
  };
  subcategories: {
    tailoring: {
      "Hard Skills": string;
      "Soft Skills": string;
      "Keyword Density": string;
    };
    content: {
      "ATS Parse Rate": string;
      "Spelling & Grammar": string;
      "Quantifiable Results": string;
    };
    sections: {
      "Contact Information": string;
      "Professional Summary": string;
      Skills: string;
      Experience: string;
      Education: string;
    };
    style: {
      "Font Style": string;
      "Email Format": string;
      "Active Voice": string;
      "Bullet Points": string;
    };
  };
}

export default function ResumeCheckerPage() {
  const contentRef = useRef<HTMLDivElement>(null);
  const reactToPrintFn = useReactToPrint({
    contentRef,
    documentTitle: "resume",
  });
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
  const [themeColor, setThemeColor] = useState("#FF4800");
  const [fontFamily, setFontFamily] = useState("Roboto");
  const [fontSize, setFontSize] = useState("11");
  const [documentSize, setDocumentSize] = useState("Letter");
  const [workExperienceTitle, setWorkExperienceTitle] =
    useState("WORK EXPERIENCE");
  const [educationTitle, setEducationTitle] = useState("EDUCATION");
  const [projectTitle, setProjectTitle] = useState("PROJECTS");
  const [skillsTitle, setSkillsTitle] = useState("SKILLS");
  const [hideExperience, setHideExperience] = useState(false);
  const [hideEducation, setHideEducation] = useState(false);
  const [hideProjects, setHideProjects] = useState(false);
  const [hideSkills, setHideSkills] = useState(false);
  // buidler
  const [atsOutput, setAtsOutput] = useState(null);
  const [atsGenerated, setAtsGenerated] = useState(false);
  const [atsShow, setAtsShow] = useState(false);
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  // Objective
  const [objective, setObjective] = useState("");

  // Work Experience
  const [experience, setExperience] = useState([]);

  // Education
  const [education, setEducation] = useState([]);

  // Projects
  const [projects, setProjects] = useState([]);

  // Skills
  const [skills, setSkills] = useState([]);

  const [ainame, aisetName] = useState("");
  const [ailocation, aisetLocation] = useState("");
  const [aiphone, aisetPhone] = useState("");
  const [aiemail, aisetEmail] = useState("");
  const [aiwebsite, aisetWebsite] = useState("");
  // Objective
  const [aiobjective, aisetObjective] = useState("");

  // Work Experience
  const [aiexperience, aisetExperience] = useState([]);

  // Education
  const [aieducation, aisetEducation] = useState([]);

  // Projects
  const [aiprojects, aisetProjects] = useState([]);

  // Skills
  const [aiskills, aisetSkills] = useState([]);

  // checker
  const [parsedText, setParsedText] = useState("");
  const [n8nData, setN8nData] = useState<ResumeAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [scoreLoader, setScoreLoader] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    setAtsOutput(null);
    setAtsGenerated(false);
    setAtsShow(false);

    setLoading(true);
    try {
      const res = await fetch("/api/parse-pdf", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to parse PDF");
      const data = await res.json();
      setParsedText(data.text);
      // resume data extract
      const webhookRes2 = await fetch(
        "https://n8n.panalinks.com/webhook/eda7f983-5085-4618-a87f-242815ff71df",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ resumeParsedText: data.text }),
        }
      );

      if (!webhookRes2.ok) {
        console.warn("Webhook call failed");
        return;
      }

      const webhookData2 = await webhookRes2.json();
      console.log("here", webhookData2);
      if (webhookData2.isItResume == true) {
        setName(webhookData2.name || "");
        setLocation(webhookData2.location || "");
        setPhone(webhookData2.phone || "");
        setEmail(webhookData2.email || "");
        setWebsite(webhookData2.website || "");
        setObjective(webhookData2.objective || "");

        setExperience(webhookData2.experience || []);
        setEducation(webhookData2.education || []);
        setProjects(webhookData2.projects || []);
        setSkills(webhookData2.skills || []);
      } else {
      }

      // check resume score
      const webhookRes = await fetch(
        "https://n8n.panalinks.com/webhook/7e8a6934-9faf-4049-bee7-6f8b8add5f7b",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ resumeParsedText: data.text }),
        }
      );

      if (!webhookRes.ok) {
        console.warn("Webhook call failed");
        return;
      }

      const webhookData = await webhookRes.json();
      console.log("here", webhookData);
      setScoreLoader(true);
      setTimeout(() => {
        setScoreLoader(false);
        setStepsLoader(true);
        setN8nData(webhookData); // ✅ no array
      }, 3000);
    } catch (err) {
      console.error("Error:", err);
      alert("Error parsing or sending data.");
    } finally {
      setLoading(false);
    }
  };
  const steps = [
    "Reading your resume",
    "Reviewing your work history",
    "Identifying your strengths",
    "Creating improvement tips",
  ];
  const [currentStep, setCurrentStep] = useState(0);
  const [stepsloader, setStepsLoader] = useState(false);
  const [stepsStopped, setSteppsStopper] = useState(false);
  useEffect(() => {
    if (stepsloader) {
      if (currentStep < steps.length) {
        const timer = setTimeout(() => {
          setCurrentStep((prev) => prev + 1);
        }, 3000); // 3 seconds per step
        return () => clearTimeout(timer);
      } else {
        setStepsLoader(false);
        setSteppsStopper(true);
      }
    }
  }, [currentStep, stepsloader]);
  const [expanded, setExpanded] = useState<string | null>(null);

  const toggle = (key: string) => {
    setExpanded(expanded === key ? null : key);
  };

  const getBadgeColor = (score: number) => {
    return score == 100
      ? "bg-green-100 text-green-700"
      : "bg-orange-100 text-orange-600";
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
  const [resumeLoader, setResumeLoader] = useState(false);
  const [aigenerateLoader, setAIGenerateLoader] = useState(false);
  const handleRedirect = () => {
    setResumeLoader(true);
    setTimeout(() => {
      // Redirect to the resume checker page after 1 second
      window.location.href =
        "https://app.winyourinterview.ai/jobs/ats-resume-builder/";
    }, 3000);
  };

  const handleAIGenerate = async () => {
    try {
      setAIGenerateLoader(true);
      const payload = {
        data: JSON.stringify({
          name,
          location,
          phone,
          email,
          website,
          objective,
          experience,
          education,
          projects,
          skills,
        }),
      };
      const webhookRes = await fetch(
        "https://n8n.panalinks.com/webhook/f3079888-7d1d-4814-9acb-0fc59690b93b",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!webhookRes.ok) {
        console.warn("Webhook call failed");
        setAIGenerateLoader(false);
        return;
      }

      const webhookData = await webhookRes.json();
      console.log("AI suggestions response:", webhookData);
      setAtsOutput(webhookData);
      aisetName(webhookData.name || "");
      aisetLocation(webhookData.location || "");
      aisetPhone(webhookData.phone || "");
      aisetEmail(webhookData.email || "");
      aisetWebsite(webhookData.website || "");
      aisetObjective(webhookData.objective || "");
      aisetExperience(webhookData.experience || []);
      aisetEducation(webhookData.education || []);
      aisetProjects(webhookData.projects || []);
      aisetSkills(webhookData.skills || []);

      setAtsShow(true);
      setAtsGenerated(true);
    } catch (error) {
      setAtsShow(false);
      setAtsGenerated(false);
      console.error("AI generation error:", error);
    } finally {
      setAIGenerateLoader(false);
    }
  };
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
  return resumeLoader ? (
    <div className="bg-white min-h-screen flex justify-center items-center">
      <span
        className="loading loading-infinity text-green-500"
        style={{ width: "70px", height: "70px" }}
      />
    </div>
  ) : (
    <>
      <div
        data-theme={theme}
        className="bg-base-100 text-base-content font-sans transition-colors duration-300"
      >
        {/* header */}
        {!scoreLoader && !n8nData && (
          <nav
            className="navbar bg-transparent px-4 sm:px-20"
            role="navigation"
            aria-label="Main navigation"
          >
            <div className="flex-1 flex items-center">
              {/* nextjs image */}
              <a
                href="https://winyourinterview.ai/"
                target="_blank"
                className="btn btn-ghost"
              >
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
                  href="https://app.winyourinterview.ai/jobs/resume-builder"
                  target="_blank"
                  className="hidden md:btn btn-ghost"
                >
                  <p>ATS Resume Builder</p>
                </a>
                <p className="hidden sm:btn btn-md">{username.split(" ")[0]}</p>

                <Link
                  href={"/profile"}
                  className="block p-1 rounded-full border-1 border-white hover:ring-2 ring-white transition duration-200"
                >
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
        )}
      </div>
      <div>
        {scoreLoader ? (
          <div className="bg-white min-h-screen flex justify-center items-center">
            <span
              className="loading loading-infinity text-green-500"
              style={{ width: "70px", height: "70px" }}
            />
          </div>
        ) : n8nData ? (
          <>
            <div className="min-h-screen w-full bg-gray-50 flex-col justify-center items-center px-4 py-10">
              <button
                onClick={() => {
                  setN8nData(null);
                  setCurrentStep(0);
                  setScoreLoader(false);
                }}
                className="m-auto flex flex-row align-middle items-center w-full max-w-7xl overflow-hidden cursor-pointer mb-3"
              >
                <ArrowLeft color="#000000c2" size={21} />
                <p className="text-[#000000c2] ml-1">Go Back</p>
              </button>
              <div className="m-auto flex flex-col lg:flex-row w-full max-w-7xl rounded-2xl shadow-lg overflow-hidden">
                {/* Left Panel */}
                <div className="w-full lg:w-1/3 bg-white p-8 border-b lg:border-b-0 lg:border-r">
                  <h2 className="text-xl font-semibold text-gray-800 mb-5 text-center">
                    Your Score
                  </h2>
                  {/* Animation */}

                  {stepsloader ? (
                    <>
                      <div className="flex items-center justify-center">
                        <div className="w-24 h-12 border-8 border-b-transparent border-gray-200 rounded-t-full bg-transparent animate-pulse"></div>
                      </div>
                      <div className="mt-[-10] flex items-center justify-center">
                        <div className="relative w-24 h-6 flex items-center justify-center">
                          {/* Horizontal line */}
                          <div className="absolute w-full h-0.5 bg-gray-800"></div>

                          {/* Center dot */}
                          <div className="w-2 h-2 bg-black rounded-full z-10"></div>
                        </div>
                      </div>
                      <div className=" flex items-center justify-center  mb-8">
                        <div className="flex flex-col items-center space-y-2">
                          <div className="skeleton w-30 h-5 bg-gray-200 rounded-full"></div>
                          <div className="skeleton w-20 h-3 bg-gray-200 rounded-full"></div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="text-center mb-1 text-3xl font-bold text-orange-400">
                        {n8nData.overallScore}/100
                      </div>

                      <div className="space-y-2 mt-5">
                        <div className="flex justify-between">
                          <p className="text-sm font-semibold text-gray-600">
                            Result:
                          </p>
                          <p
                            className={`text-sm font-semibold  ${
                              n8nData.verdict.toLowerCase() == "fail"
                                ? "text-red-600"
                                : "text-green-600"
                            }`}
                          >
                            {n8nData.verdict}
                          </p>
                        </div>

                        <div className="">
                          <p className="text-sm font-semibold text-gray-600">
                            Reason:
                          </p>
                          <p className="text-sm text-orange-600">
                            {n8nData.reason}
                          </p>
                        </div>
                        <div className="flex justify-between">
                          <p className="text-sm font-semibold text-gray-600">
                            Issues:
                          </p>
                          <p className="text-sm text-red-600">
                            {n8nData.issueCount}
                          </p>
                        </div>
                      </div>
                    </>
                  )}

                  <hr className="border-gray-200 my-4" />

                  {stepsloader ? (
                    <div className="space-y-4">
                      {[
                        "Tailoring",
                        "Content",
                        "Section",
                        "ATS Essentials",
                        "style",
                      ].map((label) => (
                        <div
                          key={label}
                          className="flex justify-between items-center"
                        >
                          <span className="text-sm font-medium text-gray-600 uppercase">
                            {label}
                          </span>
                          <div className="skeleton w-20 h-3 bg-gray-200 rounded-full"></div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-6 ">
                      {Object.entries(n8nData.scoreBreakdown).map(
                        ([category, score]) => {
                          const key = category.toLowerCase();
                          const scoreNum = Number(score);
                          const badgeClass = getBadgeColor(scoreNum);

                          return (
                            <div key={key}>
                              {/* Section Header */}
                              <div
                                className="flex justify-between items-center cursor-pointer"
                                onClick={() => toggle(key)}
                              >
                                <span className="text-sm font-medium text-gray-600 uppercase">
                                  {category}
                                </span>
                                <div className="flex items-center space-x-1">
                                  <span
                                    className={`text-xs font-semibold px-2 py-0.5 rounded-full ${badgeClass}`}
                                  >
                                    {scoreNum}%
                                  </span>
                                  {expanded === key ? (
                                    <ChevronUpIcon className="w-4 h-4 text-gray-400" />
                                  ) : (
                                    <ChevronDownIcon className="w-4 h-4 text-gray-400" />
                                  )}
                                </div>
                              </div>

                              {/* Subcategories */}
                              {expanded === key &&
                                n8nData.subcategories[
                                  category as keyof typeof n8nData.subcategories
                                ] &&
                                Object.entries(
                                  n8nData.subcategories[
                                    category as keyof typeof n8nData.subcategories
                                  ]
                                ).map(([subName, subScore]) => (
                                  <div
                                    key={subName}
                                    className="pl-4 mt-3 space-y-1"
                                  >
                                    <div className="flex justify-between text-sm text-gray-700">
                                      <span>{subName}</span>
                                      <span>{subScore}/100</span>
                                    </div>
                                    <div className="w-full bg-gray-100 rounded-full h-2">
                                      <div
                                        className="bg-indigo-500 h-2 rounded-full"
                                        style={{ width: `${subScore}%` }}
                                      />
                                    </div>
                                  </div>
                                ))}
                            </div>
                          );
                        }
                      )}
                    </div>
                  )}
                  {/*  */}
                  <hr className="border-gray-200 my-6" />

                  {stepsloader ? (
                    <button
                      className="animate-pulse mt-6 w-full bg-gray-200 text-gray-400 font-semibold py-2 rounded-lg cursor-not-allowed text-sm flex items-center justify-center space-x-2"
                      disabled
                    >
                      Updating your resume skills
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setN8nData(null);
                        setCurrentStep(0);
                        setScoreLoader(false);
                      }}
                      className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded-lg text-sm flex items-center justify-center space-x-2"
                    >
                      <span>Upload new file</span>
                      <Upload />
                    </button>
                  )}
                </div>

                {/* Right Panel */}
                <div className="w-full lg:w-2/3 bg-indigo-50 p-8">
                  <ul className="space-y-6 text-gray-700 text-lg">
                    {steps.map((step, index) => (
                      <li
                        key={step}
                        className={`flex items-center space-x-3 ${
                          index === currentStep
                            ? "text-purple-400"
                            : "text-[#2d3639]"
                        }`}
                      >
                        {index < currentStep ? (
                          <CheckIcon />
                        ) : index === currentStep ? (
                          <CheckIcon outline />
                        ) : (
                          <div className="w-5 h-5 rounded-full border border-gray-300"></div> // future steps as placeholder
                        )}
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-10 h-0.5 bg-white w-full"></div>
                  {/* show resume if available */}
                  {stepsloader ? (
                    <></>
                  ) : atsGenerated ? (
                    <>
                      <div className="flex justify-center items-center bg-gray-100 relative">
                        <div
                          ref={contentRef}
                          className={`print-container bg-white border-black border-[12px] hide-scrollbar shadow-lg ${fontMap[fontFamily]}`}
                          style={{
                            width:
                              documentSize === "Letter" ? "816px" : "794px",
                            height:
                              documentSize === "Letter" ? "1056px" : "1123px",
                            transform: "scale(0.7)", // scale down for screen preview
                            fontSize: `${fontSize}pt`,
                            overflowY: "auto",
                            overflowX: "hidden",
                          }}
                        >
                          {/* Floating Button */}
                          <div className="px-[60pt] py-8 font-normal text-[#171717]">
                            {/* Name & Contact */}
                            <div className="flex flex-col items-center gap-1 mb-3">
                              <h1
                                className="font-bold text-[18pt] text-center"
                                style={{ color: themeColor }}
                              >
                                {ainame}
                              </h1>
                              <div className="flex flex-wrap justify-center items-center gap-2 text-[10pt]">
                                {[aiphone, aiemail, aiwebsite, ailocation]
                                  .filter(Boolean)
                                  .map((item, idx, arr) => (
                                    <React.Fragment key={idx}>
                                      <span>{item}</span>
                                      {idx < arr.length - 1 && (
                                        <span className="w-px h-[10pt] bg-[#2e2e2e]"></span>
                                      )}
                                    </React.Fragment>
                                  ))}
                              </div>
                            </div>

                            {/* Divider */}
                            <div className="w-full h-px bg-[#2e2e2e] my-2"></div>

                            {/* Objective */}
                            <h2
                              className="font-bold text-[12pt]"
                              style={{ color: themeColor }}
                            >
                              OBJECTIVE
                            </h2>
                            <p className="text-[#171717] font-normal mt-[6pt]">
                              {aiobjective}
                            </p>

                            <div className="w-full h-px bg-[#2e2e2e] my-2"></div>

                            {/* Work Experience */}
                            {!hideExperience && (
                              <h2
                                className="font-bold tracking-wide text-[12pt]"
                                style={{ color: themeColor }}
                              >
                                {workExperienceTitle}
                              </h2>
                            )}
                            {!hideExperience &&
                              aiexperience?.map((exp, i) => (
                                <div key={i} className="mt-[6pt]">
                                  <div className="flex justify-between">
                                    <div>
                                      <p className="text-[#171717] font-normal">
                                        {exp.jobTitle}
                                      </p>
                                      <p className="text-[#171717] font-bold">
                                        {exp.company}
                                      </p>
                                    </div>
                                    <p className="text-[#171717] text-[10pt]">
                                      {exp.date}
                                    </p>
                                  </div>
                                  <div className="flex flex-col mt-[4.5pt]">
                                    {(Array.isArray(exp.bullets)
                                      ? exp.bullets
                                      : exp.bullets?.split("\n") || []
                                    )
                                      .filter(Boolean)
                                      .map((line, bi) =>
                                        line.trim() ? (
                                          <div key={bi} className="flex">
                                            <span className="font-bold px-[6pt]">
                                              •
                                            </span>
                                            <span className="flex-1">
                                              {line}
                                            </span>
                                          </div>
                                        ) : null
                                      )}
                                  </div>
                                </div>
                              ))}

                            {!hideExperience && (
                              <div className="w-full h-px bg-[#2e2e2e] my-2"></div>
                            )}

                            {/* Education */}
                            {!hideEducation && (
                              <h2
                                className="font-bold tracking-wide text-[12pt]"
                                style={{ color: themeColor }}
                              >
                                {educationTitle}
                              </h2>
                            )}
                            {!hideEducation &&
                              aieducation?.map((edu, i) => (
                                <div key={i} className="mt-[6pt]">
                                  <p className="text-[#171717] font-bold">
                                    {edu.school}
                                  </p>
                                  <div className="flex justify-between mt-[4.5pt]">
                                    <p className="text-[#171717]">
                                      {edu.degree && edu.gpa
                                        ? `${edu.degree} - ${edu.gpa}`
                                        : edu.degree || edu.gpa || ""}
                                    </p>
                                    <p className="text-[#171717]">{edu.date}</p>
                                  </div>
                                  {edu.details && (
                                    <div className="flex mt-[4.5pt]">
                                      <span className="font-bold px-[6pt]">
                                        •
                                      </span>
                                      <span className="flex-1">
                                        {edu.details}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              ))}

                            {!hideEducation && (
                              <div className="w-full h-px bg-[#2e2e2e] my-2"></div>
                            )}

                            {/* Projects */}
                            {!hideProjects && (
                              <h2
                                className="font-bold tracking-wide text-[12pt]"
                                style={{ color: themeColor }}
                              >
                                {projectTitle}
                              </h2>
                            )}
                            {!hideProjects &&
                              aiprojects?.map((proj, i) => (
                                <div key={i} className="mt-[6pt]">
                                  <div className="flex justify-between">
                                    <p className="text-[#171717] font-bold">
                                      {proj.title}{" "}
                                      {proj.tech && `(${proj.tech})`}
                                    </p>
                                  </div>
                                  <div className="flex mt-[4.5pt]">
                                    <span className="font-bold px-[6pt]">
                                      {proj.desc !== "" && "•"}
                                    </span>
                                    <span className="flex-1">{proj.desc}</span>
                                  </div>
                                </div>
                              ))}

                            {!hideProjects && (
                              <div className="w-full h-px bg-[#2e2e2e] my-2"></div>
                            )}

                            {/* Skills */}
                            {!hideSkills && (
                              <h2
                                className="font-bold tracking-wide text-[12pt]"
                                style={{ color: themeColor }}
                              >
                                {skillsTitle}
                              </h2>
                            )}
                            {!hideSkills && (
                              <div className="mt-3 grid grid-cols-2 gap-x-8 gap-y-2">
                                {aiskills?.map((skill, i) => (
                                  <div key={i} className="flex items-center">
                                    <span className="font-bold px-[6pt]">
                                      •
                                    </span>
                                    <span>{skill}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                        {/* Continue with ATS Resume editor */}

                        <div className="absolute bottom-14 z-10">
                          <button
                            onClick={handleRedirect}
                            className="px-5 py-3 cursor-pointer bg-[#FF4800]  text-[#ffffff]  font-medium"
                          >
                            Continue with ATS Resume Editor
                          </button>
                        </div>

                        {/* Buttons */}
                        <div className="absolute top-4 right-4 z-10">
                          <div className="flex bg-[#e0e0e0] rounded-lg p-1 w-fit">
                            <button
                              onClick={reactToPrintFn}
                              className=" text-white px-4 py-2 rounded shadow transition"
                              style={{ backgroundColor: themeColor }}
                            >
                              Print Resume
                            </button>
                          </div>
                        </div>
                        <div className="absolute top-4 left-4 z-10">
                          <div className="flex bg-[#e0e0e0] rounded-lg p-1 w-fit">
                            {/* Original Button */}
                            <button
                              onClick={() => {
                                setAtsGenerated(false);
                              }}
                              className="px-5 py-1 cursor-pointer  text-[#384347]  font-medium"
                            >
                              Basic
                            </button>

                            {/* Enhancv Button */}
                            <button className="flex items-center gap-2 px-8 py-2 cursor-progress  rounded-lg text-green-500 font-semibold bg-white">
                              <img
                                src="/gemini.png"
                                alt="AI Logo"
                                className="w-5 h-5"
                              />
                              ATS Compatible
                            </button>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      {aigenerateLoader ? (
                        <div className="flex justify-center items-center bg-gray-100 relative">
                          <div
                            className={`print-container bg-white border-black border-[12px] hide-scrollbar shadow-lg ${fontMap[fontFamily]}`}
                            style={{
                              width:
                                documentSize === "Letter" ? "816px" : "794px",
                              height:
                                documentSize === "Letter" ? "1056px" : "1123px",
                              transform: "scale(0.7)", // scale down for screen preview
                              fontSize: `${fontSize}pt`,
                              overflowY: "auto",
                              overflowX: "hidden",
                            }}
                          >
                            <div className="flex items-center justify-center h-full">
                              <span
                                className="loading loading-spinner text-gray-500"
                                style={{ width: "70px", height: "70px" }}
                              />
                            </div>
                          </div>
                          <div className="absolute top-4 left-4 z-10">
                            <div className="flex items-center gap-2 px-7 py-5 text-sm font-mona-sans text-indigo-600 bg-white rounded-lg shadow-md border border-gray-200 hover:bg-indigo-50 hover:text-indigo-800 transition-colors duration-200">
                              <img
                                src="/gemini.png"
                                alt="AI Logo"
                                className="w-5 h-5"
                              />
                              <span
                                className="loading loading-spinner text-indigo-600"
                                style={{ width: "20px", height: "20px" }}
                              />
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex justify-center items-center bg-gray-100 relative">
                          <div
                            ref={contentRef}
                            className={`print-container bg-white border-black border-[12px] hide-scrollbar shadow-lg ${fontMap[fontFamily]}`}
                            style={{
                              width:
                                documentSize === "Letter" ? "816px" : "794px",
                              height:
                                documentSize === "Letter" ? "1056px" : "1123px",
                              transform: "scale(0.7)", // scale down for screen preview
                              fontSize: `${fontSize}pt`,
                              overflowY: "auto",
                              overflowX: "hidden",
                            }}
                          >
                            {/* Floating Button */}

                            <div className="px-[60pt] py-8 font-normal text-[#171717]">
                              {/* Name & Contact */}
                              <div className="flex flex-col items-center gap-1 mb-3">
                                <h1
                                  className="font-bold text-[18pt] text-center"
                                  style={{ color: themeColor }}
                                >
                                  {name}
                                </h1>
                                <div className="flex flex-wrap justify-center items-center gap-2 text-[10pt]">
                                  {[phone, email, website, location]
                                    .filter(Boolean)
                                    .map((item, idx, arr) => (
                                      <React.Fragment key={idx}>
                                        <span>{item}</span>
                                        {idx < arr.length - 1 && (
                                          <span className="w-px h-[10pt] bg-[#2e2e2e]"></span>
                                        )}
                                      </React.Fragment>
                                    ))}
                                </div>
                              </div>

                              {/* Divider */}
                              <div className="w-full h-px bg-[#2e2e2e] my-2"></div>

                              {/* Objective */}
                              <h2
                                className="font-bold text-[12pt]"
                                style={{ color: themeColor }}
                              >
                                OBJECTIVE
                              </h2>
                              <p className="text-[#171717] font-normal mt-[6pt]">
                                {objective}
                              </p>

                              <div className="w-full h-px bg-[#2e2e2e] my-2"></div>

                              {/* Work Experience */}
                              {!hideExperience && (
                                <h2
                                  className="font-bold tracking-wide text-[12pt]"
                                  style={{ color: themeColor }}
                                >
                                  {workExperienceTitle}
                                </h2>
                              )}
                              {!hideExperience &&
                                experience.map((exp, i) => (
                                  <div key={i} className="mt-[6pt]">
                                    <div className="flex justify-between">
                                      <div>
                                        <p className="text-[#171717] font-normal">
                                          {exp.jobTitle}
                                        </p>
                                        <p className="text-[#171717] font-bold">
                                          {exp.company}
                                        </p>
                                      </div>
                                      <p className="text-[#171717] text-[10pt]">
                                        {exp.date}
                                      </p>
                                    </div>
                                    <div className="flex flex-col mt-[4.5pt]">
                                      {exp.bullets.split("\n").map((line, bi) =>
                                        line.trim() ? (
                                          <div key={bi} className="flex">
                                            <span className="font-bold px-[6pt]">
                                              •
                                            </span>
                                            <span className="flex-1">
                                              {line}
                                            </span>
                                          </div>
                                        ) : null
                                      )}
                                    </div>
                                  </div>
                                ))}

                              {!hideExperience && (
                                <div className="w-full h-px bg-[#2e2e2e] my-2"></div>
                              )}

                              {/* Education */}
                              {!hideEducation && (
                                <h2
                                  className="font-bold tracking-wide text-[12pt]"
                                  style={{ color: themeColor }}
                                >
                                  {educationTitle}
                                </h2>
                              )}
                              {!hideEducation &&
                                education.map((edu, i) => (
                                  <div key={i} className="mt-[6pt]">
                                    <p className="text-[#171717] font-bold">
                                      {edu.school}
                                    </p>
                                    <div className="flex justify-between mt-[4.5pt]">
                                      <p className="text-[#171717]">
                                        {edu.degree && edu.gpa
                                          ? `${edu.degree} - ${edu.gpa}`
                                          : edu.degree || edu.gpa || ""}
                                      </p>
                                      <p className="text-[#171717]">
                                        {edu.date}
                                      </p>
                                    </div>
                                    {edu.details && (
                                      <div className="flex mt-[4.5pt]">
                                        <span className="font-bold px-[6pt]">
                                          •
                                        </span>
                                        <span className="flex-1">
                                          {edu.details}
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                ))}

                              {!hideEducation && (
                                <div className="w-full h-px bg-[#2e2e2e] my-2"></div>
                              )}

                              {/* Projects */}
                              {!hideProjects && (
                                <h2
                                  className="font-bold tracking-wide text-[12pt]"
                                  style={{ color: themeColor }}
                                >
                                  {projectTitle}
                                </h2>
                              )}
                              {!hideProjects &&
                                projects.map((proj, i) => (
                                  <div key={i} className="mt-[6pt]">
                                    <div className="flex justify-between">
                                      <p className="text-[#171717] font-bold">
                                        {proj.title}{" "}
                                        {proj.tech && `(${proj.tech})`}
                                      </p>
                                    </div>
                                    <div className="flex mt-[4.5pt]">
                                      <span className="font-bold px-[6pt]">
                                        {proj.desc !== "" && "•"}
                                      </span>
                                      <span className="flex-1">
                                        {proj.desc}
                                      </span>
                                    </div>
                                  </div>
                                ))}

                              {!hideProjects && (
                                <div className="w-full h-px bg-[#2e2e2e] my-2"></div>
                              )}

                              {/* Skills */}
                              {!hideSkills && (
                                <h2
                                  className="font-bold tracking-wide text-[12pt]"
                                  style={{ color: themeColor }}
                                >
                                  {skillsTitle}
                                </h2>
                              )}
                              {!hideSkills && (
                                <div className="mt-3 grid grid-cols-2 gap-x-8 gap-y-2">
                                  {skills.map((skill, i) => (
                                    <div key={i} className="flex items-center">
                                      <span className="font-bold px-[6pt]">
                                        •
                                      </span>
                                      <span>{skill}</span>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                          {/* Continue with ATS Resume editor */}

                          <div className="absolute bottom-14 z-10">
                            <button
                              onClick={handleRedirect}
                              className="px-5 py-3 cursor-pointer bg-[#FF4800]  text-[#ffffff]  font-medium"
                            >
                              Continue with ATS Resume Editor
                            </button>
                          </div>
                          {/*  */}
                          <div className="absolute top-4 right-4 z-10">
                            <button
                              onClick={reactToPrintFn}
                              className=" text-white px-4 py-2 rounded shadow transition"
                              style={{ backgroundColor: themeColor }}
                            >
                              Print Resume
                            </button>
                          </div>
                          <div className="absolute top-4 left-4 z-10">
                            <div className="flex bg-[#e0e0e0] rounded-lg p-1 w-fit">
                              {/* Original Button */}
                              <button className="px-5 py-1 rounded-lg text-[#000000]  font-semibold bg-white">
                                Basic
                              </button>

                              {/* Enhancv Button */}

                              <button
                                onClick={() => {
                                  if (atsOutput) {
                                    setAtsGenerated(true);
                                  } else {
                                    handleAIGenerate();
                                  }
                                }}
                                className="flex items-center gap-2 px-8 py-2 cursor-pointer text-[#384347]  font-medium"
                              >
                                <img
                                  src="/gemini.png"
                                  alt="AI Logo"
                                  className="w-5 h-5"
                                />
                                ATS Compatible
                              </button>
                            </div>
                          </div>

                          {/*  */}
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="bg-white min-h-screen relative overflow-x-hidden">
            <div className="max-w-7xl mx-auto px-6 py-20 flex flex-col lg:flex-row items-start gap-16 lg:gap-24">
              <div className="flex flex-col max-w-xl w-full">
                <span className="text-indigo-600 font-semibold text-lg leading-5 tracking-wide mb-4">
                  ATS RESUME CHECKER
                </span>
                <h1 className="text-[#2d3639] font-extrabold text-5xl leading-[3.5rem] mb-6 font-mona-sans">
                  Wondering if your resume is strong
                  <br />
                  enough?
                </h1>
                <p className="text-gray-700 text-base leading-6 mb-12 max-w-lg">
                  Get instant feedback with our free AI tool — it performs vital
                  checks to help you get more interview calls.
                </p>
                <form className="border border-green-500 border-dashed rounded-lg max-w-md w-full p-8 flex flex-col items-center gap-4">
                  {loading && (
                    <>
                      <span
                        className="loading loading-ring  text-green-500 text-center"
                        style={{ width: "50px", height: "50px" }}
                      />
                      <p className="text-gray-600 font-medium">
                        We are scanning your file.
                      </p>
                    </>
                  )}
                  <p className="text-gray-700 text-center text-sm leading-5">
                    Drag and drop your resume or click to upload.
                    <br />
                    Supported formats: PDF only | Max file size: 2MB
                  </p>
                  {!loading && (
                    <>
                      <label
                        htmlFor="resume-upload"
                        className="mt-4 inline-block cursor-pointer bg-green-500 hover:bg-green-600 text-white font-semibold text-base leading-6 rounded-md px-6 py-3 transition-colors"
                      >
                        Upload Your Resume Now
                      </label>
                      <input
                        id="resume-upload"
                        type="file"
                        accept="application/pdf"
                        onChange={handleUpload}
                        className="hidden"
                      />
                    </>
                  )}
                  <div className="flex items-center gap-2 text-gray-600 font-semibold text-sm mt-2 select-none">
                    <Lock size={20} />
                    <span>Your privacy is 100% safe</span>
                  </div>
                </form>
              </div>
              <div className="flex-1 max-w-4xl w-full rounded-3xl overflow-hidden shadow-lg bg-white/90 backdrop-blur-sm border border-white/50">
                <img
                  src="/rb/resume.png"
                  alt="Resume checker dashboard"
                  className="w-full h-auto object-contain"
                  width={900}
                  height={500}
                />
              </div>
            </div>
            {/*  */}
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
                      Easily create and customize your ATS-optimized resume with
                      our intuitive drag-and-drop builder. Choose from
                      professional templates, section layouts, and design
                      options tailored to help you land more interviews.
                    </p>
                    <button
                      onClick={handleRedirect}
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
                        Build Your Resume
                      </span>
                      <ArrowRightIcon className="text-[#5f4dc7] ml-1 w-4 h-4 inline-block" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/*  */}
          </div>
        )}

        <div></div>
      </div>
    </>
  );
}
function CheckIcon({ outline = false }: { outline?: boolean }) {
  return (
    <div
      className={`w-5 h-5 flex items-center justify-center rounded-full ${
        outline
          ? "loading loading-spinner border-purple-400" // spinner
          : "bg-purple-600 text-white"
      }`}
    >
      {!outline && (
        <svg
          className="w-3 h-3"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            d="M5 13l4 4L19 7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </div>
  );
}
