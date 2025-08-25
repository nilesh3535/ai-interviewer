"use client";
import React, { useState, useEffect, useRef } from "react";
import { Lock, Upload, ArrowLeft, Star, ArrowLeftIcon } from "lucide-react";
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

export default function ResumeBuilderPage() {
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
  const [parsedText, setParsedText] = useState("");
  const [n8nData, setN8nData] = useState<ResumeAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [scoreLoader, setScoreLoader] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);
    try {
      const res = await fetch("/api/parse-pdf", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to parse PDF");
      const data = await res.json();
      setParsedText(data.text);

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
  const [resumeLoader, setResumeLoader] = useState(false);
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

  const slides = [
    {
      src: "/rb/temp1.png",
      alt: "Elegant Resume Template 1",
      href: "",
    },
    {
      src: "/rb/temp2.png",
      alt: "Elegant Resume Template 2",
      href: "",
    },
    {
      src: "/rb/temp3.png",
      alt: "Elegant Resume Template 3",
      href: "",
    },
    {
      src: "/rb/temp4.png",
      alt: "Elegant Resume Template 4",
      href: "",
    },
    {
      src: "/rb/temp5.png",
      alt: "Elegant Resume Template 5",
      href: "",
    },
    {
      src: "/rb/temp6.png",
      alt: "Elegant Resume Template 6",
      href: "",
    },
    {
      src: "/rb/temp7.png",
      alt: "Elegant Resume Template 7",
      href: "",
    },
  ];

  const handleRedirect = () => {
    setResumeLoader(true);
    setTimeout(() => {
      // Redirect to the resume checker page after 1 second
      window.location.href =
        "https://app.winyourinterview.ai/jobs/cover-letter-generator";
    }, 3000);
  };
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
              <a
                href="https://app.winyourinterview.ai/jobs/cover-letter-generator"
                target="_blank"
                className="hidden md:btn btn-ghost"
              >
                <p>Cover Letter Generator</p>
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
      </div>
      {/* Main Content */}
      <div
        className="bg-white relative overflow-x-hidden"
        style={{ paddingBottom: "50px" }}
      >
        <div className="max-w-7xl mx-auto px-6 pt-20 flex flex-col lg:flex-row items-start gap-16 lg:gap-24">
          <div className="flex flex-col max-w-xl w-full">
            <h1
              className="h1 h2-xsm m-bottom-4 m-bottom-5-xsm text-center-xsm"
              style={{
                color: "#2d3639",
                fontWeight: 700,
                fontSize: "58px",
                lineHeight: "76px",
              }}
            >
              Build an
              <span
                className="font-mona-sans"
                style={{
                  background: "linear-gradient(90deg, #604cc7, #44327b)",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  color: "#2d3639",
                  fontWeight: 700,
                  fontSize: "58px",
                  lineHeight: "76px",
                }}
              >
                {" ATS-Friendly "}
              </span>
              <span
                className="font-mona-sans"
                style={{
                  background: "linear-gradient(90deg, #604cc7, #44327b)",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  color: "#2d3639",
                  fontWeight: 700,
                  fontSize: "58px",
                  lineHeight: "76px",
                }}
              >
                Resume
              </span>
              <br />
              That Gets You Hired
            </h1>
            <div
              style={{ marginTop: "50px" }}
              className="flex gap-3 gap-4-xsm p-inline-4-xs p-inline-6-sm"
            >
              <button
                onClick={handleRedirect}
                style={{
                  fontSize: 18,
                  lineHeight: "24px",
                  padding: "13px 16px",
                  color: "#fff",
                  backgroundColor: "#2dc08d",
                  border: "none",
                  fontFamily: "Rubik, Open Sans, sans-serif",
                  fontWeight: 500,
                  cursor: "pointer",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: "4px",
                  textAlign: "center",
                  textDecoration: "none",
                  whiteSpace: "nowrap",
                  verticalAlign: "middle",
                  height: "fit-content",
                  transition: "all .3s ease-in-out",
                }}
                data-amplitude-event="homepage - sign up"
                data-amplitude-prop-button_location="Fold"
                className="_7d9Ew3rdopoMTEUs4G1Anw== nh1o124RBbCY8z2D0sMLjg== VBydUq+aZiAcG1CHXLDDPw== s6uaHA305IeoqI4xywTdvA== col-12-xsm full-width-xsm"
              >
                Build Your Resume
              </button>
              <a
                style={{
                  fontSize: 18,
                  lineHeight: "24px",
                  padding: "13px 16px",
                  color: "#384347",
                  backgroundColor: "transparent",
                  fontFamily: "Rubik, Open Sans, sans-serif",
                  fontWeight: 500,
                  cursor: "pointer",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: "4px",
                  textAlign: "center",
                  textDecoration: "none",
                  whiteSpace: "nowrap",
                  verticalAlign: "middle",
                  height: "fit-content",
                  transition: "all .3s ease-in-out",
                  border: "2px solid #384347",
                }}
                target="_blank"
                href="https://app.winyourinterview.ai/jobs/resume-checker"
                data-amplitude-event="homepage - resume checker clicked"
                data-amplitude-prop-button_location="Fold"
                className="_7d9Ew3rdopoMTEUs4G1Anw== b-xfF8e+JKV13HKT7rqnPg== VBydUq+aZiAcG1CHXLDDPw== _4ml3hVKgGZdkB-2xJdppSA== col-12-xsm full-width-xsm"
              >
                Get Your Resume Score
              </a>
            </div>
            <div className="mt-4">
              <div
                className="flex flex-row items-center"
                style={{ marginTop: "30px" }}
              >
                <div className="text-[#384347] font-bold mb-0 mr-5">
                  Built on Trust. Backed by Reviews.
                </div>
                <div className="flex items-center">
                  {[...Array(4)].map((_, i) => (
                    <span key={i}>
                      <Star className="text-yellow-500 w-5 h-5" />
                    </span>
                  ))}
                  <span>
                    <Star
                      className="text-yellow-500 w-5 h-5"
                      style={{ opacity: 0.5 }}
                    />
                  </span>
                </div>
              </div>
              <h2
                className="mt-5 font-mona-sans h4 m-bottom-8 m-bottom-4-xsm text-center-xsm"
                style={{
                  fontWeight: 400,
                  fontSize: 32,
                  lineHeight: "38px",
                  color: "#2d3639",
                }}
              >
                Pick a resume template and build your resume in minutes!
              </h2>
            </div>
          </div>
          <div className="hidden lg:block flex-1 max-w-4xl w-full rounded-3xl overflow-hidden shadow-lg bg-white/90 backdrop-blur-sm border border-white/50 ">
            {/* Resume Example Animated Images */}
            <div className="hidden-md hidden-lg hidden-xl">
              <div className="col-5 col-12-md col-12-xsm relative animation-zoom-in p-1-xsm m-top-9-sm m-top-2-xsm">
                <div
                  className="FoldImageAnimated_card__3Nznq"
                  style={{
                    height: "500px",
                    position: "relative",
                    width: "100%",
                    perspective: "500px",
                    display: "block",
                    textAlign: "center",
                  }}
                >
                  <div
                    className="FoldImageAnimated_content__5n8A2"
                    style={{
                      position: "absolute",
                      width: "100%",
                      height: "100%",
                      transition: "transform 1s ease-in",
                      transformStyle: "preserve-3d",
                    }}
                  >
                    <div
                      className="FoldImageAnimated_front__2BSzH"
                      style={{
                        position: "relative",
                        maxWidth: "366px",
                        margin: "auto",
                        top: "50%",
                        transform: "translateY(-50%)",
                      }}
                    >
                      <div className="relative">
                        <img
                          alt="Resume Example 2"
                          src="/rb/imagerot.png"
                          width={366}
                          height={518}
                          decoding="async"
                          data-nimg="1"
                          className="FoldImageAnimated_resumeTwo__Yu6L5"
                          style={{
                            color: "transparent",
                            position: "relative",
                            maxWidth: "100%",
                            height: "auto",
                            zIndex: 1,
                          }}
                        />
                        <div
                          className="FoldImageAnimated_fontsTwo__aTPxa animation-slide-fade-in-left"
                          style={{
                            position: "absolute",
                            bottom: "-4%",
                            left: "-12%",
                            width: "54%",
                            zIndex: 0,
                          }}
                        >
                          <img
                            alt="Resume Fonts"
                            src="/rb/side.png"
                            width={229}
                            height={451}
                            decoding="async"
                            data-nimg="1"
                            loading="lazy"
                            style={{
                              color: "transparent",
                              width: "100%",
                              height: "auto",
                            }}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="FoldImageAnimated_back__STkbo">
                      <div className="FoldImageAnimated_resumeTwoContainer__VRALz">
                        <Image
                          alt="Resume Example 2"
                          src="/rb/imagerot.png"
                          width={366}
                          height={518}
                          className="FoldImageAnimated_resumeTwo__Yu6L5"
                          style={{ color: "transparent" }}
                        />
                        <div
                          className="FoldImageAnimated_newEntryTwo__7OuQ1 animation-slide-fade-in-right"
                          style={{
                            position: "absolute",
                            width: "70%",
                            bottom: 0,
                            right: "-7%",
                            zIndex: 3,
                          }}
                        >
                          <Image
                            alt="Resume Text Decoration"
                            src="/rb/bottom.png"
                            width={287}
                            height={143}
                            loading="lazy"
                            style={{
                              color: "transparent",
                              width: "100%",
                              height: "auto",
                            }}
                          />
                        </div>
                        <div
                          style={{
                            position: "absolute",
                            top: "-4%",
                            left: "-8%",
                            color: "#57cda4",
                            border: "1px solid #57cda4",
                            borderRadius: "28px",
                          }}
                          className="FoldImageAnimated_hiredTwo__wGro5 bg-primary-cc font-weight-700 p-inline-2 p-block-0 animation-bounce"
                        >
                          HIRED
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* End Resume Example Animated Images */}
          </div>
        </div>
      </div>
      {/* Carousel */}
      <EmblaCarousel slides={slides} handleRedirect={handleRedirect} />
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
                  Let our AI analyze your resume with over 250 in-depth checks —
                  covering layout, wording, keywords, and more. Instantly get
                  personalized, actionable feedback to improve your chances of
                  getting hired.
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
        {/* Second Feature Section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 py-12 px-6 md:px-16 lg:px-24">
          {/* Left side image */}
          <div className="flex-1 flex">
            <img
              src="/cletters.png"
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
                  Boost Your Job Applications with AI-Powered Cover Letters
                </h3>
                <p
                  style={{
                    lineHeight: 1.6,
                    color: "#384347",
                    margin: "0 0 8px",
                    fontSize: 16,
                  }}
                >
                  Let our AI craft a tailored, role-specific cover letter in
                  moments — highlighting your strengths, achievements, and
                  keywords recruiters look for. Instantly get a professional,
                  polished cover letter that makes you stand out.
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
                    Build My Cover Letter Now
                  </span>
                  <ArrowRightIcon className="text-[#5f4dc7] ml-1 w-4 h-4 inline-block" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
