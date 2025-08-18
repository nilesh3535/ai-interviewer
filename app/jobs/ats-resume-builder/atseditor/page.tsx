"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Briefcase,
  GraduationCap,
  FolderGit2,
  Wrench,
  Plus,
  ChevronUp,
  ChevronDown,
  Eye,
  ChevronLeft,
  EyeOff,
} from "lucide-react";
import { Cog6ToothIcon } from "@heroicons/react/24/outline";
import { useReactToPrint } from "react-to-print";
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
import { toast } from "sonner";
import Lottie, { LottieComponentProps } from "lottie-react";
import { useRouter } from "next/router";

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

export default function Atseditor() {
  const [animationData, setAnimationData] = useState<
    LottieComponentProps["animationData"] | null
  >(null);

  useEffect(() => {
    const loadAnimations = async () => {
      const res1 = await fetch("/loaders/hello.json");
      const json1 = await res1.json();
      setAnimationData(json1);
    };
    loadAnimations();
  }, []);

  const contentRef = useRef<HTMLDivElement>(null);
  const reactToPrintFn = useReactToPrint({ contentRef });
  // Header
  const [name, setName] = useState("John Doe");
  const [location, setLocation] = useState("Bengaluru, Karnataka, India");
  const [phone, setPhone] = useState("+91-0000000000");
  const [email, setEmail] = useState("john.doe@example.com");
  const [website, setWebsite] = useState("linkedin.com/in/johndoe");
  const [themeColor, setThemeColor] = useState("#FF4800");
  const [fontFamily, setFontFamily] = useState("Roboto");
  const [fontSize, setFontSize] = useState("11");
  const [documentSize, setDocumentSize] = useState("Letter");

  const themeColors = [
    "#f87171",
    "#FF4800",
    "#fb923c",
    "#f97316",
    "#fbbf24",
    "#f59e0b",
    "#22c55e",
    "#15803d",
    "#38bdf8",
    "#0ea5e9",
    "#818cf8",
    "#6366f1",
  ];

  const fontFamilies = [
    "Roboto",
    "Lato",
    "Montserrat",
    "Open Sans",
    "Raleway",
    "Noto Serif",
    "Lora",
    "Roboto Slab",
    "Playfair Display",
    "Merriweather",
  ];

  const fontSizes = [
    { label: "Compact", value: "10" },
    { label: "Standard", value: "11" },
    { label: "Large", value: "12" },
  ];

  const docSizes = [
    { label: "Letter", sub: "(US, Canada)", value: "Letter" },
    { label: "A4", sub: "(other countries)", value: "A4" },
  ];
  // Objective
  const [objective, setObjective] = useState(
    "Experienced Senior Frontend Engineer with 9+ years of expertise building scalable, user-centric web applications. Skilled in modern JavaScript frameworks, performance tuning, and responsive design. Collaborative team player passionate about delivering high-quality digital solutions that drive business growth."
  );

  // Work Experience
  const [experience, setExperience] = useState([
    {
      jobTitle: "Senior Frontend Engineer",
      company: "TechNova Solutions Pvt. Ltd. — Bengaluru, India",
      date: "April 2020 – Present",
      bullets: `Led the development of a scalable SaaS platform using React.js and TypeScript, increasing user engagement by 30%.
Developed a reusable component library with Storybook to ensure UI consistency across teams.
Improved application load time by 25% through code splitting and performance optimization.`,
    },
  ]);

  // Education
  const [education, setEducation] = useState([
    {
      degree: "Bachelor of Technology in Computer Science",
      school: "National Institute of Technology (NIT) — Warangal, India",
      date: "Graduated: May 2015",
      gpa: "GPA: 9.2/10",
    },
  ]);

  // Projects
  const [projects, setProjects] = useState([
    {
      title: "Real-Time Analytics Dashboard",
      tech: "(React | Redux | D3.js)",
      desc: "Developed a real-time analytics dashboard with dynamic visualizations, reducing load times by 40%.",
    },
  ]);

  // Skills
  const [skills, setSkills] = useState([
    "React.js",
    "Next.js",
    "Vue.js",
    "Nuxt.js",
    "Node.js",
    "Express",
    "MongoDB",
    "Firebase",
    "Git",
    "Webpack",
    "Jest",
    "Storybook",
  ]);

  const [gotParsed, gotParsedData] = useState(false);
  const [loading, setLoading] = useState(false);
  const [scoreLoader, setScoreLoader] = useState(false);
  const [parsedText, setParsedText] = useState("");
  const [rerror, setRError] = useState("");
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);
    setRError("");
    try {
      const res = await fetch("/api/parse-pdf", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to parse PDF");
      const data = await res.json();
      setParsedText(data.text);

      const webhookRes = await fetch(
        "https://n8n.panalinks.com/webhook/eda7f983-5085-4618-a87f-242815ff71df",
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
      if (webhookData.isItResume == true) {
        setName(webhookData.name || "");
        setLocation(webhookData.location || "");
        setPhone(webhookData.phone || "");
        setEmail(webhookData.email || "");
        setWebsite(webhookData.website || "");
        setObjective(webhookData.objective || "");

        setExperience(webhookData.experience || []);
        setEducation(webhookData.education || []);
        setProjects(webhookData.projects || []);
        setSkills(webhookData.skills || []);

        setScoreLoader(true);
        setTimeout(() => {
          gotParsedData(true);
          setScoreLoader(false);
        }, 3000);
      } else {
        gotParsedData(false);
        toast.error(
          "We couldn’t detect a resume in your file. Please upload your resume as a PDF document."
        );
        setRError(
          "We couldn’t detect a resume in your file. Please upload your resume as a PDF document."
        );
      }
    } catch (err) {
      gotParsedData(false);
      console.error("Error:", err);
      alert("Error parsing or sending data.");
    } finally {
      setLoading(false);
    }
  };
  const [workExperienceTitle, setWorkExperienceTitle] =
    useState("WORK EXPERIENCE");
  const [educationTitle, setEducationTitle] = useState("EDUCATION");
  const [projectTitle, setProjectTitle] = useState("PROJECTS");
  const [skillsTitle, setSkillsTitle] = useState("SKILLS");

  const [hideExperience, setHideExperience] = useState(false);
  const [hideEducation, setHideEducation] = useState(false);
  const [hideProjects, setHideProjects] = useState(false);
  const [hideSkills, setHideSkills] = useState(false);

  const [isMounted, setIsMounted] = useState(false);
  const [smallScreen, setSmallScreen] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    const checkScreenSize = () => {
      const isSmall = window.matchMedia("(max-width: 1023px)").matches;
      console.log("Screen size check:", isSmall);
      setSmallScreen(isSmall);
    };

    // Initial check
    checkScreenSize();

    // Listen for resize
    window.addEventListener("resize", checkScreenSize);

    return () => {
      window.removeEventListener("resize", checkScreenSize);
    };
  }, [smallScreen]); // runs only on mount
  const [suggestType, setSuggestType] = useState("");
  const [aigenerateLoader, setAIGenerateLoader] = useState(false);
  const [atsOutput, setAtsOutput] = useState(null);
  const [atsGenerated, setAtsGenerated] = useState(false);
  const [atsShow, setAtsShow] = useState(false);

  //
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
  return (
    <>
      {scoreLoader ? (
        <div className="bg-white min-h-screen flex justify-center items-center">
          <span
            className="loading loading-infinity text-green-500"
            style={{ width: "70px", height: "70px" }}
          />
        </div>
      ) : gotParsed ? (
        <>
          {smallScreen ? (
            <div className="flex flex-col bg-white h-screen justify-center align-center items-center">
              <h1 className="text-red-600">
                "Oops! This feature looks better on a bigger screen 📺"
              </h1>
            </div>
          ) : (
            <div className="flex flex-col md:flex-row h-screen">
              {/* Left Editor */}
              <div className="w-1/2 p-6 overflow-y-auto bg-white border-r">
                <div className="flex items-center justify-between mb-6">
                  <button
                    onClick={() => {
                      window.history.back();
                    }}
                    aria-label="Go back"
                    className="cursor-pointer text-gray-600 hover:text-black"
                  >
                    <ChevronLeft size={35} />
                  </button>
                  <h1
                    style={{ color: themeColor }}
                    className="text-2xl font-bold mb-4"
                  >
                    ATS Resume Builder
                  </h1>
                </div>

                {/*  */}
                {atsShow ? (
                  <>
                    {/* Basic Info */}
                    <section className="bg-white flex flex-col gap-3 rounded-md border border-slate-200 p-6 pt-4 shadow transition-opacity duration-200 undefined">
                      <div className="grid grid-cols-6 gap-3 text-[#374151] mb-4">
                        <label className="text-base font-medium text-gray-700 col-span-3">
                          Name
                          <input
                            placeholder="Name"
                            className="mt-1 px-3 py-2 block w-full rounded-md border border-gray-300 text-gray-900 shadow-sm outline-none font-normal text-base"
                            type="text"
                            value={ainame}
                            onChange={(e) => aisetName(e.target.value)}
                          />
                        </label>

                        <label className="text-base font-medium text-gray-700 col-span-3">
                          Location
                          <input
                            placeholder="Bengaluru, Karnataka, India"
                            className="mt-1 px-3 py-2 block w-full rounded-md border border-gray-300 text-gray-900 shadow-sm outline-none font-normal text-base"
                            type="text"
                            value={ailocation}
                            onChange={(e) => aisetLocation(e.target.value)}
                          />
                        </label>

                        <label className="text-base font-medium text-gray-700 col-span-3">
                          Phone
                          <input
                            placeholder="+91-0000000000"
                            className="mt-1 px-3 py-2 block w-full rounded-md border border-gray-300 text-gray-900 shadow-sm outline-none font-normal text-base"
                            type="text"
                            value={aiphone}
                            onChange={(e) => aisetPhone(e.target.value)}
                          />
                        </label>

                        <label className="text-base font-medium text-gray-700 col-span-3">
                          Email
                          <input
                            placeholder="john.doe@example.com"
                            className="mt-1 px-3 py-2 block w-full rounded-md border border-gray-300 text-gray-900 shadow-sm outline-none font-normal text-base"
                            type="text"
                            value={aiemail}
                            onChange={(e) => aisetEmail(e.target.value)}
                          />
                        </label>

                        <label className="text-base font-medium text-gray-700 col-span-full">
                          Website
                          <input
                            placeholder="linkedin.com/in/johndoe"
                            className="mt-1 px-3 py-2 block w-full rounded-md border border-gray-300 text-gray-900 shadow-sm outline-none font-normal text-base"
                            type="text"
                            value={aiwebsite}
                            onChange={(e) => aisetWebsite(e.target.value)}
                          />
                        </label>

                        {/* Objective with AI Button */}
                        <div className="relative col-span-full">
                          <label className="text-base font-medium text-gray-700 col-span-full relative w-full">
                            Objective
                            <textarea
                              name="summary"
                              className="h-[180px] mt-1 px-3 py-2 block w-full rounded-md border border-gray-300 text-gray-900 shadow-sm outline-none font-normal text-base overflow-hidden"
                              placeholder="objective"
                              value={aiobjective}
                              onChange={(e) => aisetObjective(e.target.value)}
                            />
                          </label>
                        </div>
                      </div>
                    </section>
                    {/* Work Experience */}
                    <section
                      style={{
                        backgroundColor: hideExperience ? "#f0f0f0" : "#FFFFFF",
                      }}
                      className="bg-white flex flex-col gap-3 rounded-md border border-slate-200 p-6 pt-4 shadow pb-6 transition-opacity duration-200"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex grow items-center gap-2">
                          <Briefcase className="h-6 w-6 text-gray-600" />
                          <input
                            className="block w-full border-b border-transparent text-lg font-semibold tracking-wide text-gray-900 outline-none hover:border-gray-300 hover:shadow-sm focus:border-gray-300 focus:shadow-sm"
                            type="text"
                            value={workExperienceTitle}
                            maxLength={30}
                            onChange={(e) =>
                              setWorkExperienceTitle(e.target.value)
                            }
                          />
                          {/* hide unhide section */}
                          <button
                            onClick={() => setHideExperience(!hideExperience)}
                            className="text-gray-600 hover:text-black"
                            title={
                              hideExperience
                                ? "Show Work Experience"
                                : "Hide Work Experience"
                            }
                          >
                            {hideExperience ? (
                              <EyeOff className="h-6 w-6 text-gray-400" />
                            ) : (
                              <Eye className="h-6 w-6 text-gray-600" />
                            )}
                          </button>
                        </div>
                      </div>

                      <div
                        className="grid overflow-hidden transition-all duration-300 visible"
                        style={{ gridTemplateRows: "1fr" }}
                      >
                        {aiexperience.map((exp, i) => (
                          <div key={i} className="min-h-0 mb-6">
                            <div className="relative grid grid-cols-6 gap-3">
                              {/* Header row */}
                              <div
                                style={{
                                  borderLeftWidth: "4px",
                                  borderLeftColor: themeColor,
                                }}
                                className="col-span-full flex h-9 items-center justify-between bg-slate-100 px-3 py-2"
                              >
                                <h3 className="text-sm font-semibold text-slate-900">{`${
                                  i + 1
                                } Experience`}</h3>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const updated = [...aiexperience];
                                    updated.splice(i, 1);
                                    aisetExperience(updated);
                                  }}
                                  className="text-red-500 hover:text-red-700"
                                  title="Delete Experience"
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth="1.5"
                                    stroke="currentColor"
                                    className="w-5 h-5"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      d="M6 18L18 6M6 6l12 12"
                                    />
                                  </svg>
                                </button>
                              </div>

                              {/* Company */}
                              <label className="text-base font-medium text-gray-700 col-span-full">
                                Company
                                <input
                                  placeholder="Company Name"
                                  className="mt-1 px-3 py-2 block w-full rounded-md border border-gray-300 text-gray-900 shadow-sm outline-none font-normal text-base"
                                  type="text"
                                  value={exp.company}
                                  onChange={(e) => {
                                    const updated = [...aiexperience];
                                    updated[i].company = e.target.value;
                                    aisetExperience(updated);
                                  }}
                                />
                              </label>

                              {/* Job Title */}
                              <label className="text-base font-medium text-gray-700 col-span-4">
                                Job Title
                                <input
                                  placeholder="Job Title"
                                  className="mt-1 px-3 py-2 block w-full rounded-md border border-gray-300 text-gray-900 shadow-sm outline-none font-normal text-base"
                                  type="text"
                                  value={exp.jobTitle}
                                  onChange={(e) => {
                                    const updated = [...aiexperience];
                                    updated[i].jobTitle = e.target.value;
                                    aisetExperience(updated);
                                  }}
                                />
                              </label>

                              {/* Date */}
                              <label className="text-base font-medium text-gray-700 col-span-2">
                                Date
                                <input
                                  placeholder="APR 2024 - Present"
                                  className="mt-1 px-3 py-2 block w-full rounded-md border border-gray-300 text-gray-900 shadow-sm outline-none font-normal text-base"
                                  type="text"
                                  value={exp.date}
                                  onChange={(e) => {
                                    const updated = [...aiexperience];
                                    updated[i].date = e.target.value;
                                    aisetExperience(updated);
                                  }}
                                />
                              </label>

                              {/* Description / Bullets */}
                              <label className="text-base font-medium text-gray-700 col-span-full">
                                Description
                                <div className="mt-1 px-3 py-2 block w-full rounded-md border border-gray-300 text-gray-900 shadow-sm outline-none font-normal text-base cursor-text pl-7">
                                  <textarea
                                    className="h-[150px] w-full border-none outline-none  bg-transparent"
                                    value={exp.bullets}
                                    onChange={(e) => {
                                      const updated = [...aiexperience];
                                      updated[i].bullets = e.target.value;
                                      aisetExperience(updated);
                                    }}
                                  />
                                </div>
                              </label>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="mt-2 flex">
                        <button
                          type="button"
                          onClick={() =>
                            aisetExperience([
                              ...aiexperience,
                              {
                                jobTitle: "",
                                company: "",
                                date: "",
                                bullets: "",
                              },
                            ])
                          }
                          className="bg-white text-[#007CEE] flex items-center rounded-md py-2 pl-3 pr-4 text-sm font-semibold shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            aria-hidden="true"
                            data-slot="icon"
                            className="text-link -ml-0.5 mr-1.5 h-5 w-5"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M12 4.5v15m7.5-7.5h-15"
                            />
                          </svg>
                          Add an experience
                        </button>
                      </div>
                    </section>

                    {/* Education */}
                    <section
                      style={{
                        backgroundColor: hideEducation ? "#f0f0f0" : "#FFFFFF",
                      }}
                      className="bg-white flex flex-col gap-3 rounded-md border border-slate-200 p-6 pt-4 shadow transition-opacity duration-200 pb-6"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex grow items-center gap-2">
                          <GraduationCap className="h-6 w-6 text-gray-600" />
                          <input
                            className="block w-full border-b border-transparent text-lg font-semibold tracking-wide text-gray-900 outline-none hover:border-gray-300 hover:shadow-sm focus:border-gray-300 focus:shadow-sm"
                            type="text"
                            value={educationTitle}
                            maxLength={30}
                            onChange={(e) => setEducationTitle(e.target.value)}
                          />
                          <button
                            onClick={() => setHideEducation(!hideEducation)}
                            className="text-gray-600 hover:text-black"
                            title={
                              hideEducation
                                ? "Show Education"
                                : "Hide Education"
                            }
                          >
                            {hideEducation ? (
                              <EyeOff className="h-6 w-6 text-gray-400" />
                            ) : (
                              <Eye className="h-6 w-6 text-gray-600" />
                            )}
                          </button>
                        </div>
                        <div className="flex items-center gap-0.5">
                          {/* Up / Down / Hide buttons */}
                        </div>
                      </div>

                      <div
                        className="grid overflow-hidden transition-all duration-300 visible"
                        style={{ gridTemplateRows: "1fr" }}
                      >
                        {aieducation.map((edu, i) => (
                          <div key={i} className="min-h-0">
                            <div className="relative grid grid-cols-6 gap-3">
                              {/* Header */}
                              <div
                                style={{
                                  borderLeftWidth: "4px",
                                  borderLeftColor: themeColor,
                                }}
                                className="mt-5 col-span-full flex h-9 items-center justify-between bg-slate-100 px-3 py-2"
                              >
                                <h3 className="text-sm font-semibold text-slate-900">{`${
                                  i + 1
                                } Section`}</h3>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const updated = [...aieducation];
                                    updated.splice(i, 1);
                                    aisetEducation(updated);
                                  }}
                                  className="text-red-500 hover:text-red-700"
                                  title="Delete Education"
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth="1.5"
                                    stroke="currentColor"
                                    className="w-5 h-5"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      d="M6 18L18 6M6 6l12 12"
                                    />
                                  </svg>
                                </button>
                              </div>

                              {/* School */}
                              <label className="text-base font-medium text-gray-700 col-span-4">
                                School
                                <input
                                  placeholder="Final Round AI University"
                                  className="mt-1 px-3 py-2 block w-full rounded-md border border-gray-300 text-gray-900 shadow-sm outline-none font-normal text-base"
                                  type="text"
                                  value={edu.school}
                                  onChange={(e) => {
                                    const updated = [...aieducation];
                                    updated[i].school = e.target.value;
                                    aisetEducation(updated);
                                  }}
                                />
                              </label>

                              {/* Date */}
                              <label className="text-base font-medium text-gray-700 col-span-2">
                                Date
                                <input
                                  placeholder="APR 2024"
                                  className="mt-1 px-3 py-2 block w-full rounded-md border border-gray-300 text-gray-900 shadow-sm outline-none font-normal text-base"
                                  type="text"
                                  value={edu.date}
                                  onChange={(e) => {
                                    const updated = [...aieducation];
                                    updated[i].date = e.target.value;
                                    aisetEducation(updated);
                                  }}
                                />
                              </label>

                              {/* Degree */}
                              <label className="text-base font-medium text-gray-700 col-span-4">
                                Degree &amp; Major
                                <input
                                  placeholder="Bachelor of Science in Computer Engineering"
                                  className="mt-1 px-3 py-2 block w-full rounded-md border border-gray-300 text-gray-900 shadow-sm outline-none font-normal text-base"
                                  type="text"
                                  value={edu.degree}
                                  onChange={(e) => {
                                    const updated = [...aieducation];
                                    updated[i].degree = e.target.value;
                                    aisetEducation(updated);
                                  }}
                                />
                              </label>

                              {/* GPA */}
                              <label className="text-base font-medium text-gray-700 col-span-2">
                                GPA
                                <input
                                  placeholder="4.00"
                                  className="mt-1 px-3 py-2 block w-full rounded-md border border-gray-300 text-gray-900 shadow-sm outline-none font-normal text-base"
                                  type="text"
                                  value={edu.gpa}
                                  onChange={(e) => {
                                    const updated = [...aieducation];
                                    updated[i].gpa = e.target.value;
                                    aisetEducation(updated);
                                  }}
                                />
                              </label>

                              {/* Additional Info with AI Button */}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Add School Button */}
                      <div className="mt-2 flex">
                        <button
                          type="button"
                          onClick={() =>
                            aisetEducation([
                              ...aieducation,
                              { degree: "", school: "", date: "", gpa: "" },
                            ])
                          }
                          className="bg-white text-[#007CEE] flex items-center rounded-md py-2 pl-3 pr-4 text-sm font-semibold shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            aria-hidden="true"
                            data-slot="icon"
                            className="text-link -ml-0.5 mr-1.5 h-5 w-5"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M12 4.5v15m7.5-7.5h-15"
                            />
                          </svg>
                          Add School
                        </button>
                      </div>
                    </section>
                    {/*  */}

                    {/* Projects */}

                    <section
                      style={{
                        backgroundColor: hideProjects ? "#f0f0f0" : "#FFFFFF",
                      }}
                      className="bg-white flex flex-col gap-3 rounded-md border border-slate-200 p-6 pt-4 shadow transition-opacity duration-200 pb-6"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex grow items-center gap-2">
                          <FolderGit2 className="w-4 h-4 mr-2 text-gray-600" />
                          <input
                            className="block w-full border-b border-transparent text-lg font-semibold tracking-wide text-gray-900 outline-none hover:border-gray-300 hover:shadow-sm focus:border-gray-300 focus:shadow-sm"
                            type="text"
                            value={projectTitle}
                            maxLength={30}
                            onChange={(e) => setProjectTitle(e.target.value)}
                          />
                          <button
                            onClick={() => setHideProjects(!hideProjects)}
                            className="text-gray-600 hover:text-black"
                            title={
                              hideProjects ? "Show Projects" : "Hide Projects"
                            }
                          >
                            {hideProjects ? (
                              <EyeOff className="h-6 w-6 text-gray-400" />
                            ) : (
                              <Eye className="h-6 w-6 text-gray-600" />
                            )}
                          </button>
                        </div>
                        <div className="flex items-center gap-0.5">
                          {/* Up / Down / Hide buttons */}
                        </div>
                      </div>{" "}
                      {aiprojects.map((proj, i) => (
                        <div
                          key={i}
                          className="relative grid grid-cols-6 gap-3 border-t border-gray-200 pt-4 first:border-t-0 first:pt-0"
                        >
                          <div
                            style={{
                              borderLeftWidth: "4px",
                              borderLeftColor: themeColor,
                            }}
                            className="col-span-full flex h-9 items-center justify-between bg-slate-100 px-3 py-2"
                          >
                            <h3 className="text-sm font-semibold text-slate-900">{`${
                              i + 1
                            } Project`}</h3>
                            <button
                              type="button"
                              onClick={() => {
                                const updated = [...aiprojects];
                                updated.splice(i, 1);
                                aisetProjects(updated);
                              }}
                              className="text-red-500 hover:text-red-700"
                              title="Delete Project"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="currentColor"
                                className="w-5 h-5"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M6 18L18 6M6 6l12 12"
                                />
                              </svg>
                            </button>
                          </div>

                          {/* Project Title */}
                          <label className="text-base font-medium text-gray-700 col-span-4">
                            Project Name
                            <input
                              placeholder="Project Title"
                              className="mt-1 px-3 py-2 block w-full rounded-md border border-gray-300 text-gray-900 shadow-sm outline-none font-normal text-base"
                              type="text"
                              value={proj.title}
                              onChange={(e) => {
                                const updated = [...aiprojects];
                                updated[i].title = e.target.value;
                                aisetProjects(updated);
                              }}
                            />
                          </label>

                          {/* Date / Tech */}
                          <label className="text-base font-medium text-gray-700 col-span-2">
                            Tech / Date
                            <input
                              placeholder="React, Node, 2024"
                              className="mt-1 px-3 py-2 block w-full rounded-md border border-gray-300 text-gray-900 shadow-sm outline-none font-normal text-base"
                              type="text"
                              value={proj.tech}
                              onChange={(e) => {
                                const updated = [...aiprojects];
                                updated[i].tech = e.target.value;
                                aisetProjects(updated);
                              }}
                            />
                          </label>

                          {/* Description */}
                          <label className="text-base font-medium text-gray-700 col-span-full">
                            Description
                            <textarea
                              placeholder="Describe your project..."
                              className="h-[120px] mt-1 px-3 py-2 block w-full rounded-md border border-gray-300 text-gray-900 shadow-sm outline-none font-normal text-base"
                              value={proj.desc}
                              onChange={(e) => {
                                const updated = [...aiprojects];
                                updated[i].desc = e.target.value;
                                aisetProjects(updated);
                              }}
                            />
                          </label>
                        </div>
                      ))}
                      {/* Add Project Button */}
                      <div className="mt-2 flex">
                        <button
                          type="button"
                          onClick={() =>
                            aisetProjects([
                              ...aiprojects,
                              { title: "", tech: "", desc: "" },
                            ])
                          }
                          className="bg-white text-[#007CEE] flex items-center rounded-md py-2 pl-3 pr-4 text-sm font-semibold shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            aria-hidden="true"
                            data-slot="icon"
                            className="text-link -ml-0.5 mr-1.5 h-5 w-5"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M12 4.5v15m7.5-7.5h-15"
                            />
                          </svg>
                          Add Project
                        </button>
                      </div>
                    </section>

                    {/* Skills */}

                    <section
                      style={{
                        backgroundColor: hideSkills ? "#f0f0f0" : "#FFFFFF",
                      }}
                      className=" flex flex-col gap-3 rounded-md border border-slate-200 p-6 pt-4 shadow pb-6"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex grow items-center gap-2">
                          <Wrench className="w-4 h-4 mr-2 text-gray-600" />
                          <input
                            className="block w-full border-b border-transparent text-lg font-semibold tracking-wide text-gray-900 outline-none hover:border-gray-300 hover:shadow-sm focus:border-gray-300 focus:shadow-sm"
                            type="text"
                            value={skillsTitle}
                            maxLength={30}
                            onChange={(e) => setSkillsTitle(e.target.value)}
                          />
                          <button
                            onClick={() => setHideSkills(!hideSkills)}
                            className="text-gray-600 hover:text-black"
                            title={hideSkills ? "Show Skills" : "Hide Skills"}
                          >
                            {hideSkills ? (
                              <EyeOff className="h-6 w-6 text-gray-400" />
                            ) : (
                              <Eye className="h-6 w-6 text-gray-600" />
                            )}
                          </button>
                        </div>
                        <div className="flex items-center gap-0.5">
                          {/* Up / Down / Hide buttons */}
                        </div>
                      </div>

                      <div className="col-span-full grid grid-cols-6 gap-3">
                        {/* Skills List */}
                        <label className="text-base font-medium text-gray-700 col-span-full">
                          Skills List
                          <textarea
                            className="mt-1 px-3 py-2 block w-full rounded-md border border-gray-300 text-gray-900 shadow-sm outline-none font-normal text-base resize-none min-h-[150px]"
                            placeholder="e.g. React.js, Tailwind CSS, Redux, REST APIs"
                            value={aiskills.join("\n")}
                            onChange={(e) =>
                              aisetSkills(
                                e.target.value.split("\n").map((s) => s.trim())
                              )
                            }
                          />
                        </label>
                      </div>

                      <div className="col-span-full mb-4 mt-6 border-t-2 border-dotted border-gray-200"></div>
                    </section>
                    {/* ------------------- */}
                  </>
                ) : (
                  <>
                    {/* Basic Info */}
                    <section className="bg-white flex flex-col gap-3 rounded-md border border-slate-200 p-6 pt-4 shadow transition-opacity duration-200 undefined">
                      <div className="grid grid-cols-6 gap-3 text-[#374151] mb-4">
                        <label className="text-base font-medium text-gray-700 col-span-3">
                          Name
                          <input
                            placeholder="Name"
                            className="mt-1 px-3 py-2 block w-full rounded-md border border-gray-300 text-gray-900 shadow-sm outline-none font-normal text-base"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                          />
                        </label>

                        <label className="text-base font-medium text-gray-700 col-span-3">
                          Location
                          <input
                            placeholder="Bengaluru, Karnataka, India"
                            className="mt-1 px-3 py-2 block w-full rounded-md border border-gray-300 text-gray-900 shadow-sm outline-none font-normal text-base"
                            type="text"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                          />
                        </label>

                        <label className="text-base font-medium text-gray-700 col-span-3">
                          Phone
                          <input
                            placeholder="+91-0000000000"
                            className="mt-1 px-3 py-2 block w-full rounded-md border border-gray-300 text-gray-900 shadow-sm outline-none font-normal text-base"
                            type="text"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                          />
                        </label>

                        <label className="text-base font-medium text-gray-700 col-span-3">
                          Email
                          <input
                            placeholder="john.doe@example.com"
                            className="mt-1 px-3 py-2 block w-full rounded-md border border-gray-300 text-gray-900 shadow-sm outline-none font-normal text-base"
                            type="text"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                          />
                        </label>

                        <label className="text-base font-medium text-gray-700 col-span-full">
                          Website
                          <input
                            placeholder="linkedin.com/in/johndoe"
                            className="mt-1 px-3 py-2 block w-full rounded-md border border-gray-300 text-gray-900 shadow-sm outline-none font-normal text-base"
                            type="text"
                            value={website}
                            onChange={(e) => setWebsite(e.target.value)}
                          />
                        </label>

                        {/* Objective with AI Button */}
                        <div className="relative col-span-full">
                          <label className="text-base font-medium text-gray-700 col-span-full relative w-full">
                            Objective
                            <textarea
                              name="summary"
                              className="h-[180px] mt-1 px-3 py-2 block w-full rounded-md border border-gray-300 text-gray-900 shadow-sm outline-none font-normal text-base overflow-hidden"
                              placeholder="objective"
                              value={objective}
                              onChange={(e) => setObjective(e.target.value)}
                            />
                          </label>
                        </div>
                      </div>
                    </section>
                    {/* Work Experience */}
                    <section
                      style={{
                        backgroundColor: hideExperience ? "#f0f0f0" : "#FFFFFF",
                      }}
                      className="bg-white flex flex-col gap-3 rounded-md border border-slate-200 p-6 pt-4 shadow pb-6 transition-opacity duration-200"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex grow items-center gap-2">
                          <Briefcase className="h-6 w-6 text-gray-600" />
                          <input
                            className="block w-full border-b border-transparent text-lg font-semibold tracking-wide text-gray-900 outline-none hover:border-gray-300 hover:shadow-sm focus:border-gray-300 focus:shadow-sm"
                            type="text"
                            value={workExperienceTitle}
                            maxLength={30}
                            onChange={(e) =>
                              setWorkExperienceTitle(e.target.value)
                            }
                          />
                          {/* hide unhide section */}
                          <button
                            onClick={() => setHideExperience(!hideExperience)}
                            className="text-gray-600 hover:text-black"
                            title={
                              hideExperience
                                ? "Show Work Experience"
                                : "Hide Work Experience"
                            }
                          >
                            {hideExperience ? (
                              <EyeOff className="h-6 w-6 text-gray-400" />
                            ) : (
                              <Eye className="h-6 w-6 text-gray-600" />
                            )}
                          </button>
                        </div>
                      </div>

                      <div
                        className="grid overflow-hidden transition-all duration-300 visible"
                        style={{ gridTemplateRows: "1fr" }}
                      >
                        {experience.map((exp, i) => (
                          <div key={i} className="min-h-0 mb-6">
                            <div className="relative grid grid-cols-6 gap-3">
                              {/* Header row */}
                              <div
                                style={{
                                  borderLeftWidth: "4px",
                                  borderLeftColor: themeColor,
                                }}
                                className="col-span-full flex h-9 items-center justify-between bg-slate-100 px-3 py-2"
                              >
                                <h3 className="text-sm font-semibold text-slate-900">{`${
                                  i + 1
                                } Experience`}</h3>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const updated = [...experience];
                                    updated.splice(i, 1);
                                    setExperience(updated);
                                  }}
                                  className="text-red-500 hover:text-red-700"
                                  title="Delete Experience"
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth="1.5"
                                    stroke="currentColor"
                                    className="w-5 h-5"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      d="M6 18L18 6M6 6l12 12"
                                    />
                                  </svg>
                                </button>
                              </div>

                              {/* Company */}
                              <label className="text-base font-medium text-gray-700 col-span-full">
                                Company
                                <input
                                  placeholder="Company Name"
                                  className="mt-1 px-3 py-2 block w-full rounded-md border border-gray-300 text-gray-900 shadow-sm outline-none font-normal text-base"
                                  type="text"
                                  value={exp.company}
                                  onChange={(e) => {
                                    const updated = [...experience];
                                    updated[i].company = e.target.value;
                                    setExperience(updated);
                                  }}
                                />
                              </label>

                              {/* Job Title */}
                              <label className="text-base font-medium text-gray-700 col-span-4">
                                Job Title
                                <input
                                  placeholder="Job Title"
                                  className="mt-1 px-3 py-2 block w-full rounded-md border border-gray-300 text-gray-900 shadow-sm outline-none font-normal text-base"
                                  type="text"
                                  value={exp.jobTitle}
                                  onChange={(e) => {
                                    const updated = [...experience];
                                    updated[i].jobTitle = e.target.value;
                                    setExperience(updated);
                                  }}
                                />
                              </label>

                              {/* Date */}
                              <label className="text-base font-medium text-gray-700 col-span-2">
                                Date
                                <input
                                  placeholder="APR 2024 - Present"
                                  className="mt-1 px-3 py-2 block w-full rounded-md border border-gray-300 text-gray-900 shadow-sm outline-none font-normal text-base"
                                  type="text"
                                  value={exp.date}
                                  onChange={(e) => {
                                    const updated = [...experience];
                                    updated[i].date = e.target.value;
                                    setExperience(updated);
                                  }}
                                />
                              </label>

                              {/* Description / Bullets */}
                              <label className="text-base font-medium text-gray-700 col-span-full">
                                Description
                                <div className="mt-1 px-3 py-2 block w-full rounded-md border border-gray-300 text-gray-900 shadow-sm outline-none font-normal text-base cursor-text pl-7">
                                  <textarea
                                    className="h-[150px] w-full border-none outline-none  bg-transparent"
                                    value={exp.bullets}
                                    onChange={(e) => {
                                      const updated = [...experience];
                                      updated[i].bullets = e.target.value;
                                      setExperience(updated);
                                    }}
                                  />
                                </div>
                              </label>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="mt-2 flex">
                        <button
                          type="button"
                          onClick={() =>
                            setExperience([
                              ...experience,
                              {
                                jobTitle: "",
                                company: "",
                                date: "",
                                bullets: "",
                              },
                            ])
                          }
                          className="bg-white text-[#007CEE] flex items-center rounded-md py-2 pl-3 pr-4 text-sm font-semibold shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            aria-hidden="true"
                            data-slot="icon"
                            className="text-link -ml-0.5 mr-1.5 h-5 w-5"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M12 4.5v15m7.5-7.5h-15"
                            />
                          </svg>
                          Add an experience
                        </button>
                      </div>
                    </section>

                    {/* Education */}
                    <section
                      style={{
                        backgroundColor: hideEducation ? "#f0f0f0" : "#FFFFFF",
                      }}
                      className="bg-white flex flex-col gap-3 rounded-md border border-slate-200 p-6 pt-4 shadow transition-opacity duration-200 pb-6"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex grow items-center gap-2">
                          <GraduationCap className="h-6 w-6 text-gray-600" />
                          <input
                            className="block w-full border-b border-transparent text-lg font-semibold tracking-wide text-gray-900 outline-none hover:border-gray-300 hover:shadow-sm focus:border-gray-300 focus:shadow-sm"
                            type="text"
                            value={educationTitle}
                            maxLength={30}
                            onChange={(e) => setEducationTitle(e.target.value)}
                          />
                          <button
                            onClick={() => setHideEducation(!hideEducation)}
                            className="text-gray-600 hover:text-black"
                            title={
                              hideEducation
                                ? "Show Education"
                                : "Hide Education"
                            }
                          >
                            {hideEducation ? (
                              <EyeOff className="h-6 w-6 text-gray-400" />
                            ) : (
                              <Eye className="h-6 w-6 text-gray-600" />
                            )}
                          </button>
                        </div>
                        <div className="flex items-center gap-0.5">
                          {/* Up / Down / Hide buttons */}
                        </div>
                      </div>

                      <div
                        className="grid overflow-hidden transition-all duration-300 visible"
                        style={{ gridTemplateRows: "1fr" }}
                      >
                        {education.map((edu, i) => (
                          <div key={i} className="min-h-0">
                            <div className="relative grid grid-cols-6 gap-3">
                              {/* Header */}
                              <div
                                style={{
                                  borderLeftWidth: "4px",
                                  borderLeftColor: themeColor,
                                }}
                                className="mt-5 col-span-full flex h-9 items-center justify-between bg-slate-100 px-3 py-2"
                              >
                                <h3 className="text-sm font-semibold text-slate-900">{`${
                                  i + 1
                                } Section`}</h3>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const updated = [...education];
                                    updated.splice(i, 1);
                                    setEducation(updated);
                                  }}
                                  className="text-red-500 hover:text-red-700"
                                  title="Delete Education"
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth="1.5"
                                    stroke="currentColor"
                                    className="w-5 h-5"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      d="M6 18L18 6M6 6l12 12"
                                    />
                                  </svg>
                                </button>
                              </div>

                              {/* School */}
                              <label className="text-base font-medium text-gray-700 col-span-4">
                                School
                                <input
                                  placeholder="Final Round AI University"
                                  className="mt-1 px-3 py-2 block w-full rounded-md border border-gray-300 text-gray-900 shadow-sm outline-none font-normal text-base"
                                  type="text"
                                  value={edu.school}
                                  onChange={(e) => {
                                    const updated = [...education];
                                    updated[i].school = e.target.value;
                                    setEducation(updated);
                                  }}
                                />
                              </label>

                              {/* Date */}
                              <label className="text-base font-medium text-gray-700 col-span-2">
                                Date
                                <input
                                  placeholder="APR 2024"
                                  className="mt-1 px-3 py-2 block w-full rounded-md border border-gray-300 text-gray-900 shadow-sm outline-none font-normal text-base"
                                  type="text"
                                  value={edu.date}
                                  onChange={(e) => {
                                    const updated = [...education];
                                    updated[i].date = e.target.value;
                                    setEducation(updated);
                                  }}
                                />
                              </label>

                              {/* Degree */}
                              <label className="text-base font-medium text-gray-700 col-span-4">
                                Degree &amp; Major
                                <input
                                  placeholder="Bachelor of Science in Computer Engineering"
                                  className="mt-1 px-3 py-2 block w-full rounded-md border border-gray-300 text-gray-900 shadow-sm outline-none font-normal text-base"
                                  type="text"
                                  value={edu.degree}
                                  onChange={(e) => {
                                    const updated = [...education];
                                    updated[i].degree = e.target.value;
                                    setEducation(updated);
                                  }}
                                />
                              </label>

                              {/* GPA */}
                              <label className="text-base font-medium text-gray-700 col-span-2">
                                GPA
                                <input
                                  placeholder="4.00"
                                  className="mt-1 px-3 py-2 block w-full rounded-md border border-gray-300 text-gray-900 shadow-sm outline-none font-normal text-base"
                                  type="text"
                                  value={edu.gpa}
                                  onChange={(e) => {
                                    const updated = [...education];
                                    updated[i].gpa = e.target.value;
                                    setEducation(updated);
                                  }}
                                />
                              </label>

                              {/* Additional Info with AI Button */}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Add School Button */}
                      <div className="mt-2 flex">
                        <button
                          type="button"
                          onClick={() =>
                            setEducation([
                              ...education,
                              { degree: "", school: "", date: "", gpa: "" },
                            ])
                          }
                          className="bg-white text-[#007CEE] flex items-center rounded-md py-2 pl-3 pr-4 text-sm font-semibold shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            aria-hidden="true"
                            data-slot="icon"
                            className="text-link -ml-0.5 mr-1.5 h-5 w-5"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M12 4.5v15m7.5-7.5h-15"
                            />
                          </svg>
                          Add School
                        </button>
                      </div>
                    </section>
                    {/*  */}

                    {/* Projects */}

                    <section
                      style={{
                        backgroundColor: hideProjects ? "#f0f0f0" : "#FFFFFF",
                      }}
                      className="bg-white flex flex-col gap-3 rounded-md border border-slate-200 p-6 pt-4 shadow transition-opacity duration-200 pb-6"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex grow items-center gap-2">
                          <FolderGit2 className="w-4 h-4 mr-2 text-gray-600" />
                          <input
                            className="block w-full border-b border-transparent text-lg font-semibold tracking-wide text-gray-900 outline-none hover:border-gray-300 hover:shadow-sm focus:border-gray-300 focus:shadow-sm"
                            type="text"
                            value={projectTitle}
                            maxLength={30}
                            onChange={(e) => setProjectTitle(e.target.value)}
                          />
                          <button
                            onClick={() => setHideProjects(!hideProjects)}
                            className="text-gray-600 hover:text-black"
                            title={
                              hideProjects ? "Show Projects" : "Hide Projects"
                            }
                          >
                            {hideProjects ? (
                              <EyeOff className="h-6 w-6 text-gray-400" />
                            ) : (
                              <Eye className="h-6 w-6 text-gray-600" />
                            )}
                          </button>
                        </div>
                        <div className="flex items-center gap-0.5">
                          {/* Up / Down / Hide buttons */}
                        </div>
                      </div>{" "}
                      {projects.map((proj, i) => (
                        <div
                          key={i}
                          className="relative grid grid-cols-6 gap-3 border-t border-gray-200 pt-4 first:border-t-0 first:pt-0"
                        >
                          <div
                            style={{
                              borderLeftWidth: "4px",
                              borderLeftColor: themeColor,
                            }}
                            className="col-span-full flex h-9 items-center justify-between bg-slate-100 px-3 py-2"
                          >
                            <h3 className="text-sm font-semibold text-slate-900">{`${
                              i + 1
                            } Project`}</h3>
                            <button
                              type="button"
                              onClick={() => {
                                const updated = [...projects];
                                updated.splice(i, 1);
                                setProjects(updated);
                              }}
                              className="text-red-500 hover:text-red-700"
                              title="Delete Project"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="currentColor"
                                className="w-5 h-5"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M6 18L18 6M6 6l12 12"
                                />
                              </svg>
                            </button>
                          </div>

                          {/* Project Title */}
                          <label className="text-base font-medium text-gray-700 col-span-4">
                            Project Name
                            <input
                              placeholder="Project Title"
                              className="mt-1 px-3 py-2 block w-full rounded-md border border-gray-300 text-gray-900 shadow-sm outline-none font-normal text-base"
                              type="text"
                              value={proj.title}
                              onChange={(e) => {
                                const updated = [...projects];
                                updated[i].title = e.target.value;
                                setProjects(updated);
                              }}
                            />
                          </label>

                          {/* Date / Tech */}
                          <label className="text-base font-medium text-gray-700 col-span-2">
                            Tech / Date
                            <input
                              placeholder="React, Node, 2024"
                              className="mt-1 px-3 py-2 block w-full rounded-md border border-gray-300 text-gray-900 shadow-sm outline-none font-normal text-base"
                              type="text"
                              value={proj.tech}
                              onChange={(e) => {
                                const updated = [...projects];
                                updated[i].tech = e.target.value;
                                setProjects(updated);
                              }}
                            />
                          </label>

                          {/* Description */}
                          <label className="text-base font-medium text-gray-700 col-span-full">
                            Description
                            <textarea
                              placeholder="Describe your project..."
                              className="h-[120px] mt-1 px-3 py-2 block w-full rounded-md border border-gray-300 text-gray-900 shadow-sm outline-none font-normal text-base"
                              value={proj.desc}
                              onChange={(e) => {
                                const updated = [...projects];
                                updated[i].desc = e.target.value;
                                setProjects(updated);
                              }}
                            />
                          </label>
                        </div>
                      ))}
                      {/* Add Project Button */}
                      <div className="mt-2 flex">
                        <button
                          type="button"
                          onClick={() =>
                            setProjects([
                              ...projects,
                              { title: "", tech: "", desc: "" },
                            ])
                          }
                          className="bg-white text-[#007CEE] flex items-center rounded-md py-2 pl-3 pr-4 text-sm font-semibold shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            aria-hidden="true"
                            data-slot="icon"
                            className="text-link -ml-0.5 mr-1.5 h-5 w-5"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M12 4.5v15m7.5-7.5h-15"
                            />
                          </svg>
                          Add Project
                        </button>
                      </div>
                    </section>

                    {/* Skills */}

                    <section
                      style={{
                        backgroundColor: hideSkills ? "#f0f0f0" : "#FFFFFF",
                      }}
                      className=" flex flex-col gap-3 rounded-md border border-slate-200 p-6 pt-4 shadow pb-6"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex grow items-center gap-2">
                          <Wrench className="w-4 h-4 mr-2 text-gray-600" />
                          <input
                            className="block w-full border-b border-transparent text-lg font-semibold tracking-wide text-gray-900 outline-none hover:border-gray-300 hover:shadow-sm focus:border-gray-300 focus:shadow-sm"
                            type="text"
                            value={skillsTitle}
                            maxLength={30}
                            onChange={(e) => setSkillsTitle(e.target.value)}
                          />
                          <button
                            onClick={() => setHideSkills(!hideSkills)}
                            className="text-gray-600 hover:text-black"
                            title={hideSkills ? "Show Skills" : "Hide Skills"}
                          >
                            {hideSkills ? (
                              <EyeOff className="h-6 w-6 text-gray-400" />
                            ) : (
                              <Eye className="h-6 w-6 text-gray-600" />
                            )}
                          </button>
                        </div>
                        <div className="flex items-center gap-0.5">
                          {/* Up / Down / Hide buttons */}
                        </div>
                      </div>

                      <div className="col-span-full grid grid-cols-6 gap-3">
                        {/* Skills List */}
                        <label className="text-base font-medium text-gray-700 col-span-full">
                          Skills List
                          <textarea
                            className="mt-1 px-3 py-2 block w-full rounded-md border border-gray-300 text-gray-900 shadow-sm outline-none font-normal text-base resize-none min-h-[150px]"
                            placeholder="e.g. React.js, Tailwind CSS, Redux, REST APIs"
                            value={skills.join("\n")}
                            onChange={(e) =>
                              setSkills(
                                e.target.value.split("\n").map((s) => s.trim())
                              )
                            }
                          />
                        </label>
                      </div>

                      <div className="col-span-full mb-4 mt-6 border-t-2 border-dotted border-gray-200"></div>
                    </section>
                  </>
                )}
                {/* Theme and Font Settings */}
                <section className="bg-white flex flex-col gap-3 rounded-md border border-slate-200 p-6 pt-4 shadow">
                  <div className="flex flex-col gap-6">
                    {/* Header */}
                    <div className="flex items-center gap-2">
                      <Cog6ToothIcon className="h-6 w-6 text-gray-600" />
                      <div className="text-lg font-semibold tracking-wide text-gray-900">
                        Resume Settings
                      </div>
                    </div>

                    {/* Theme Color */}
                    <div>
                      <label className="flex gap-2 text-sm font-medium items-center text-gray-700">
                        <span className="w-28 text-sm leading-9">
                          Theme Color
                        </span>
                        <input
                          className="w-[6rem] border-b border-gray-300 text-center font-semibold leading-3 outline-none text-sm"
                          type="text"
                          value={themeColor}
                          onChange={(e) => setThemeColor(e.target.value)}
                          style={{ color: themeColor }}
                        />
                      </label>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {themeColors.map((color) => (
                          <div
                            key={color}
                            className="text-white flex h-10 w-10 cursor-pointer items-center justify-center rounded-md text-sm"
                            style={{
                              backgroundColor: color,
                              border:
                                color === themeColor
                                  ? `2px solid ${color}`
                                  : undefined,
                            }}
                            onClick={() => setThemeColor(color)}
                          >
                            {color === themeColor && "✓"}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Font Family */}
                    <div>
                      <label className="text-base font-medium text-gray-700">
                        Font Family
                      </label>
                      <div className="mt-2 flex flex-wrap gap-3">
                        {fontFamilies.map((font) => (
                          <div
                            key={font}
                            className={`flex w-[105px] cursor-pointer items-center justify-center rounded-md border py-1.5 shadow-sm hover:border-gray-400 hover:bg-gray-100 ${
                              font === fontFamily
                                ? "text-white"
                                : "text-gray-900 border-gray-300"
                            }`}
                            style={{
                              backgroundColor:
                                font === fontFamily ? themeColor : undefined,
                              borderColor:
                                font === fontFamily ? themeColor : undefined,
                              fontFamily: font,
                            }}
                            onClick={() => setFontFamily(font)}
                          >
                            {font}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Font Size */}
                    <div>
                      <label className="flex gap-2 text-sm font-medium items-center text-gray-700">
                        <span className="w-28 text-sm leading-9">
                          Font Size (pt)
                        </span>
                        <input
                          className="w-[6rem] border-b border-gray-300 text-center font-semibold leading-3 outline-none text-sm"
                          type="text"
                          value={fontSize}
                          onChange={(e) => setFontSize(e.target.value)}
                        />
                      </label>
                      <div className="mt-2 flex flex-wrap gap-3">
                        {fontSizes.map((size) => (
                          <div
                            key={size.value}
                            className={`flex w-[105px] cursor-pointer items-center justify-center rounded-md border py-1.5 shadow-sm hover:border-gray-400 hover:bg-gray-100 ${
                              size.value === fontSize
                                ? "text-white"
                                : "text-gray-900 border-gray-300"
                            }`}
                            style={{
                              backgroundColor:
                                size.value === fontSize
                                  ? themeColor
                                  : undefined,
                              borderColor:
                                size.value === fontSize
                                  ? themeColor
                                  : undefined,
                              fontFamily: fontFamily,
                            }}
                            onClick={() => setFontSize(size.value)}
                          >
                            {size.label}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Document Size */}
                    <div>
                      <label className="text-base font-medium text-gray-700">
                        Document Size
                      </label>
                      <div className="mt-2 flex flex-wrap gap-3">
                        {docSizes.map((doc) => (
                          <div
                            key={doc.value}
                            className={`flex w-[105px] cursor-pointer items-center justify-center rounded-md border py-1.5 shadow-sm hover:border-gray-400 hover:bg-gray-100 ${
                              doc.value === documentSize
                                ? "text-white"
                                : "text-gray-900 border-gray-300"
                            }`}
                            style={{
                              backgroundColor:
                                doc.value === documentSize
                                  ? themeColor
                                  : undefined,
                              borderColor:
                                doc.value === documentSize
                                  ? themeColor
                                  : undefined,
                            }}
                            onClick={() => setDocumentSize(doc.value)}
                          >
                            <div className="flex flex-col items-center">
                              <div>{doc.label}</div>
                              <div className="text-xs">{doc.sub}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  {/* reset button */}
                  <div className="mt-4">
                    <button
                      onClick={() => {
                        window.location.reload();
                      }}
                      className="cursor-pointer w-full bg-red-700 text-white py-2 rounded-md hover:bg-red-600 transition-colors"
                    >
                      Reset Settings
                    </button>
                  </div>
                </section>
                {/*  */}
              </div>

              {/* Right Preview */}
              {atsShow ? (
                <div className="flex justify-center items-center bg-gray-100 relative">
                  <div
                    ref={contentRef}
                    className={`print-container bg-white border-black border-[12px] hide-scrollbar shadow-lg ${fontMap[fontFamily]}`}
                    style={{
                      width: documentSize === "Letter" ? "816px" : "794px",
                      height: documentSize === "Letter" ? "1056px" : "1123px",
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
                                      <span className="flex-1">{line}</span>
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
                                <span className="font-bold px-[6pt]">•</span>
                                <span className="flex-1">{edu.details}</span>
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
                                {proj.title} {proj.tech && `(${proj.tech})`}
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
                              <span className="font-bold px-[6pt]">•</span>
                              <span>{skill}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="absolute top-4 right-4 z-10">
                    <button
                      onClick={reactToPrintFn}
                      className=" text-white px-4 py-2 rounded shadow transition"
                      style={{ backgroundColor: themeColor }}
                    >
                      Print Resume
                    </button>
                  </div>
                  <div className="absolute bottom-10 right-4 z-10">
                    <div className="flex bg-[#e0e0e0] rounded-lg p-1 w-fit">
                      {/* Original Button */}
                      <button
                        onClick={() => {
                          setAtsShow(false);
                        }}
                        className="px-5 py-1 cursor-pointer  text-[#384347]  font-medium"
                      >
                        Original
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
              ) : (
                <div className="flex justify-center items-center bg-gray-100 relative">
                  <div
                    ref={contentRef}
                    className={`print-container bg-white border-black border-[12px] hide-scrollbar shadow-lg ${fontMap[fontFamily]}`}
                    style={{
                      width: documentSize === "Letter" ? "816px" : "794px",
                      height: documentSize === "Letter" ? "1056px" : "1123px",
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
                              {exp?.bullets
                                ?.toString()
                                .split("\n")
                                .map((line, bi) =>
                                  line.trim() ? (
                                    <div key={bi} className="flex">
                                      <span className="font-bold px-[6pt]">
                                        •
                                      </span>
                                      <span className="flex-1">{line}</span>
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
                              <p className="text-[#171717]">{edu.date}</p>
                            </div>
                            {edu.details && (
                              <div className="flex mt-[4.5pt]">
                                <span className="font-bold px-[6pt]">•</span>
                                <span className="flex-1">{edu.details}</span>
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
                                {proj.title} {proj.tech && `(${proj.tech})`}
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
                          {skills.map((skill, i) => (
                            <div key={i} className="flex items-center">
                              <span className="font-bold px-[6pt]">•</span>
                              <span>{skill}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
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
                  <div className="absolute bottom-10 right-4 z-10">
                    {atsGenerated ? (
                      <div className="flex bg-[#e0e0e0] rounded-lg p-1 w-fit">
                        {/* Original Button */}
                        <button className="px-5 py-1 rounded-lg text-[#000000]  font-semibold bg-white">
                          Original
                        </button>

                        {/* Enhancv Button */}
                        <button
                          onClick={() => {
                            setAtsShow(true);
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
                    ) : aigenerateLoader ? (
                      <div className="flex items-center gap-2 px-7 py-5 text-sm font-mona-sans text-indigo-600 bg-white rounded-lg shadow-md border border-gray-200 hover:bg-indigo-50 hover:text-indigo-800 transition-colors duration-200">
                        <span
                          className="loading loading-spinner text-indigo-600"
                          style={{ width: "20px", height: "20px" }}
                        />
                      </div>
                    ) : (
                      <button
                        onClick={handleAIGenerate}
                        type="button"
                        className="cursor-pointer flex items-center gap-2 px-7 py-5 text-sm font-mona-sans text-indigo-600 bg-white rounded-lg shadow-md border border-gray-200 hover:bg-indigo-50 hover:text-indigo-800 transition-colors duration-200"
                      >
                        <img
                          src="/gemini.png"
                          alt="AI Logo"
                          className="w-5 h-5"
                        />
                        <span className="whitespace-nowrap">
                          Click to Generate ATS Compatible
                        </span>
                      </button>
                    )}
                  </div>

                  {/*  */}
                </div>
              )}
            </div>
          )}
        </>
      ) : (
        <div className="bg-white min-h-screen">
          {/* Top Navigation */}
          <div className="flex items-center justify-between py-5 px-4 border-b">
            <button
              onClick={() => {
                window.history.back();
              }}
              aria-label="Go back"
              className="cursor-pointer text-gray-600 hover:text-black"
            >
              <ChevronLeft size={35} />
            </button>
          </div>
          <div className="flex flex-col items-center justify-center mt-8">
            <Lottie
              animationData={animationData}
              loop
              autoplay
              className="w-48 h-48"
            />
            <h1 className="text-center font-mona-sans text-[32px] font-normal leading-[38px] mb-4 mt-8 text-[#2d3639]">
              Please upload your resume here:
            </h1>
            <p className="text-gray-700 text-center text-sm leading-5">
              Supported format: PDF only
            </p>
            {loading ? (
              <>
                <span
                  className="loading loading-ring  text-green-500 text-center"
                  style={{ width: "50px", height: "50px" }}
                />
                <p className="text-gray-600 font-medium">
                  We are scanning your file.
                </p>
              </>
            ) : (
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
                {rerror && <p className="text-red-500 mt-2">{rerror}</p>}
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
