"use client";
import { ArrowUp, ChevronLeft, LucideCopy } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Phone, Mail, Link as LinkIcon, MapPin } from "lucide-react";
import { toast } from "sonner";
import { set } from "zod";
// 2️⃣ Top-level font definitions
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
import { useReactToPrint } from "react-to-print";
import { Cog6ToothIcon } from "@heroicons/react/24/outline";
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
export default function Nextai() {
  const contentRef = useRef<HTMLDivElement>(null);
  const reactToPrintFn = useReactToPrint({ contentRef });
  const [themeColor, setThemeColor] = useState("#FF4800");
  const [fontFamily, setFontFamily] = useState("Roboto");
  const [fontSize, setFontSize] = useState("25");
  const [documentSize, setDocumentSize] = useState("Letter");
  const resetSettings = () => {
    setThemeColor("#FF4800");
    setFontFamily("Roboto");
    setFontSize("25");
    setDocumentSize("Letter");
  };
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
    { label: "Compact", value: "21" },
    { label: "Standard", value: "25" },
    { label: "Large", value: "27" },
  ];

  const docSizes = [
    { label: "Letter", sub: "(US, Canada)", value: "Letter" },
    { label: "A4", sub: "(other countries)", value: "A4" },
  ];
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

  const [inputData, setInputData] = useState("");
  const [aiLoader, setAiloader] = useState(false);
  const [coverletterGenerated, setCoverLetterGenerated] = useState(false);
  const [aiResponse, setAiResponse] = useState(null);
  const [isSingleLine, setIsSingleLine] = useState(true);
  const textareaRef = useRef(null);

  // Auto-resize textarea height & detect line count
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"; // reset
      textareaRef.current.style.height =
        textareaRef.current.scrollHeight + "px"; // adjust

      const lineCount = textareaRef.current.value.split("\n").length;
      const isTall = textareaRef.current.scrollHeight > 40; // ~1 line height
      setIsSingleLine(lineCount === 1 && !isTall);
    }
  }, [inputData]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // prevent new line
      generateCoverLetter(); // send message
    }
  };
  //   editor
  const [userphoto, setUserPhoto] = useState(null);
  const [header, setHeader] = useState("");
  const [body, setBody] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("");

  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [website, setWebsite] = useState("");
  const [address, setAddress] = useState("");

  const emailRef = useRef(null);
  const phoneRef = useRef(null);
  const websiteRef = useRef(null);
  const addressRef = useRef(null);

  const generateCoverLetter = async () => {
    if (!inputData) {
      toast.error("Please provide the required information", {
        position: "top-center",
        duration: 2000,
      });
      return;
    }
    setAiloader(true);
    try {
      const res = await fetch(
        "https://n8n.panalinks.com/webhook/9d41f8af-1aa7-47d0-9afc-3b56d99bc7a1",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ inputdata: inputData }),
        }
      );
      const data = await res.json();
      //   valid JSON with the keys `"letterheader"` and `"letterbody"`.
      if (data) {
        console.log("AI Response:", data);
        setAiResponse(data);
        setHeader(data.letterheader);
        setBody(data.letterbody);
        setName(data.name);
        setPhone(data.phone || "");
        setEmail(data.email || "");
        setWebsite(data.website || "");
        setAddress(data.address || "");
        setRole(data.role);

        setCoverLetter(data.letterbody);
        setCoverLetterGenerated(true);
        toast.success("Cover letter generated successfully", {
          position: "top-right",
          duration: 2000,
        });
      } else {
        toast.error("Invalid response from AI service", {
          position: "top-center",
          duration: 2000,
        });
      }
    } catch (err) {
      console.log(err);
      toast.error("Failed to generate cover letter");
    } finally {
      setAiloader(false);
    }
  };
  // sync contentEditable when state changes
  useEffect(() => {
    if (emailRef.current) emailRef.current.innerText = email || "";
    if (phoneRef.current) phoneRef.current.innerText = phone || "";
    if (websiteRef.current) websiteRef.current.innerText = website || "";
    if (addressRef.current) addressRef.current.innerText = address || "";
  }, [email, phone, website, address]);

  return (
    <>
      {coverletterGenerated ? (
        <div className="bg-white min-h-screen">
          {/* Top Navigation */}
          <div className="flex items-center justify-between py-5 px-4 border-b">
            <button
              onClick={() => {
                setCoverLetterGenerated(false);
                setInputData("");
                setAiResponse(null);
              }}
              aria-label="Go back"
              className="cursor-pointer text-gray-600 hover:text-black"
            >
              <ChevronLeft size={35} />
            </button>
            <div className="flex items-center space-x-2">
              <span className="text-xl font-semibold text-indigo-600 ">
                COVER LETTER EDITOR - POWERED BY WINYOURINTERVIEW
              </span>
            </div>
            <div className="w-16" />
          </div>

          {/* Editor */}
          <div className="flex justify-center  relative">
            {/*  */}
            {/* Theme and Font Settings */}
            <section
              style={{
                width: "516px",
              }}
              className="bg-white flex flex-col gap-3 rounded-md border border-slate-200 p-6 pt-4 shadow"
            >
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
                    <span className="w-28 text-sm leading-9">Theme Color</span>
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
                            size.value === fontSize ? themeColor : undefined,
                          borderColor:
                            size.value === fontSize ? themeColor : undefined,
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
                            doc.value === documentSize ? themeColor : undefined,
                          borderColor:
                            doc.value === documentSize ? themeColor : undefined,
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
                    resetSettings();
                  }}
                  className="cursor-pointer w-full bg-gray-300 text-black py-2 rounded-md hover:bg-gray-600 hover:text-white transition-colors"
                >
                  Reset Settings
                </button>
              </div>
            </section>
            {/*  */}
            <div
              ref={contentRef}
              className={`print-container bg-white  border-[#4f4949] border-[2px] hide-scrollbar shadow-lg ${fontMap[fontFamily]}`}
              style={{
                width: documentSize === "Letter" ? "816px" : "794px",
                height: documentSize === "Letter" ? "1056px" : "1123px",
                transform: "scale(0.9)", // scale down for screen preview
                fontSize: `${fontSize}pt`,
                overflowY: "auto",
                overflowX: "hidden",
                position: "relative",
              }}
            >
              <header className="w-full flex items-center justify-between p-6 bg-white  rounded-2xl">
                {/* Left Section */}
                <div className="flex flex-col w-full ">
                  {/* Name */}
                  <input
                    type="text"
                    placeholder="Your Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={{ fontSize: fontSize }}
                    className="font-bold uppercase text-slate-800 bg-transparent border-none outline-none w-full"
                  />

                  {/* Role */}
                  <input
                    type="text"
                    placeholder="The role you are applying for"
                    value={role}
                    style={{ color: themeColor }}
                    onChange={(e) => setRole(e.target.value)}
                    className="mb-2 text-[19px] font-medium bg-transparent border-none outline-none w-full"
                  />

                  {/* Contact Info */}
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-600">
                    <div className="flex items-center gap-2">
                      <Phone
                        style={{ color: themeColor }}
                        className="h-4 w-4"
                      />
                      <div
                        ref={phoneRef}
                        contentEditable
                        suppressContentEditableWarning
                        data-placeholder="Phone"
                        className="text-[14px] outline-none bg-transparent min-w-0 placeholder-div"
                        onInput={(e) =>
                          setPhone(e.currentTarget.textContent?.trim() || "")
                        }
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <Mail style={{ color: themeColor }} className="h-4 w-4" />
                      <div
                        ref={emailRef}
                        contentEditable
                        suppressContentEditableWarning
                        data-placeholder="Email"
                        className="text-[14px] outline-none bg-transparent min-w-0 placeholder-div"
                        onInput={(e) =>
                          setEmail(e.currentTarget.textContent?.trim() || "")
                        }
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <LinkIcon
                        style={{ color: themeColor }}
                        className="h-4 w-4"
                      />
                      <div
                        ref={websiteRef}
                        contentEditable
                        suppressContentEditableWarning
                        data-placeholder="Website"
                        className="text-[14px] outline-none bg-transparent min-w-0 placeholder-div"
                        onInput={(e) =>
                          setWebsite(e.currentTarget.textContent?.trim() || "")
                        }
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <MapPin
                        style={{ color: themeColor }}
                        className="h-4 w-4"
                      />
                      <div
                        ref={addressRef}
                        contentEditable
                        suppressContentEditableWarning
                        data-placeholder="Address"
                        className="text-[14px] outline-none bg-transparent min-w-0 placeholder-div"
                        onInput={(e) =>
                          setAddress(e.currentTarget.textContent?.trim() || "")
                        }
                      />
                    </div>
                  </div>
                  <div className="w-full h-px bg-[#2e2e2e] my-2"></div>
                  <textarea
                    className="w-full text-[#384347] leading-[22.5px] resize-none bg-transparent border-0 focus:outline-none"
                    value={coverLetter}
                    onChange={(e) => {
                      setCoverLetter(e.target.value);
                    }}
                    style={{
                      fontSize:
                        fontSize == "25"
                          ? "17px"
                          : fontSize == "27"
                          ? "19px"
                          : "16px",
                      overflow: "hidden",
                      height:
                        documentSize === "Letter"
                          ? `${1056 * 0.7}px`
                          : `${1123 * 0.7}px`,
                    }}
                  />
                </div>

                {/* Right Section (Profile Photo) */}
                <div></div>
              </header>
            </div>
            {/*  */}

            <div className="absolute top-0 right-10 z-10">
              <button
                onClick={reactToPrintFn}
                className=" text-white px-4 py-2 rounded shadow transition"
                style={{ backgroundColor: themeColor }}
              >
                Print Letter
              </button>
            </div>
          </div>

          {/*  */}
        </div>
      ) : (
        <div className="bg-violet-50 min-h-screen">
          {/* Top Navigation */}
          <div className="flex items-center justify-between py-5 px-4 border-b">
            <button
              onClick={() => window.history.back()}
              aria-label="Go back"
              className="cursor-pointer text-gray-600 hover:text-black"
            >
              <ChevronLeft size={35} />
            </button>
            <div className="flex items-center space-x-2">
              <span className="text-xl font-semibold text-indigo-600 ">
                COVER LETTER GENERATOR
              </span>
            </div>
            <div className="w-16" />
          </div>
          {/* ai */}
          <div className="flex justify-center items-centerbg-gray-50 p-4">
            <div className="bg-white w-full max-w-2/3 rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <p className="text-orange-500 mb-4 font-medium text-xl">
                  We need some information from you to create a personalized
                  cover letter:
                </p>
                <img src="/gemini.png" alt="AI Logo" className="w-10 h-10" />
              </div>
              <ol className="list-decimal list-inside space-y-4 ">
                <li className="text-[#111827]">
                  <span className="font-semibold">Job Description:</span> Share
                  the key responsibilities and requirements from the job
                  posting.
                </li>
                <li className="text-[#111827]">
                  <span className="font-semibold">Company Name:</span> Provide
                  the name of the company you are applying to.
                </li>
                <li className="text-[#111827]">
                  <span className="font-semibold">
                    Experience, Skills & Projects:
                  </span>{" "}
                  Mention notable projects, accomplishments, and relevant
                  technologies or skills you have worked with.
                </li>
                <li className="text-[#111827]">
                  <span className="font-semibold">Your Motivation:</span>{" "}
                  Explain why you are interested in this particular position or
                  company.
                </li>
                <li className="text-[#111827]">
                  <span className="font-semibold">
                    Personal Info(optional):
                  </span>{" "}
                  Your Name, Phone, Email, LinkedIn/Portfolio Url
                </li>
              </ol>

              <p className="mt-6 text-indigo-600">
                Once you provide these details, I can draft a tailored cover
                letter for you!
              </p>

              {/* e.g */}
              <div className="text-md text-gray-600 ml-2 my-2">
                <p className="text-red-300">Example input</p>
                John Doe, john.doe@example.com, +91-0000000000,
                linkedin.com/in/johndoe, Bengaluru, India
                <br />
                Web Designer
                <br /> Tata Consultancy Services (TCS)
                <br /> 2 years experience, HTML, CSS, JavaScript, React.js,
                Figma
                <br /> Built employee portal & corporate dashboards
                <br /> Interested in TCS for global innovation opportunities
              </div>
              {/*  */}
              <div
                className={`bg-[#eceff6] mt-6 flex border border-gray-300 px-4 py-2 shadow-sm transition-all duration-200 relative ${
                  isSingleLine
                    ? "items-center rounded-full"
                    : "items-start rounded-md"
                }`}
              >
                <textarea
                  ref={textareaRef}
                  value={inputData}
                  onChange={(e) => setInputData(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={aiLoader}
                  placeholder="Send a message to Cover Letter Generator"
                  className="pt-1 flex-grow resize-none outline-none border-none focus:ring-0 bg-transparent text-gray-700 placeholder-gray-400 text-base overflow-hidden pr-12"
                  rows={1}
                  style={{ minHeight: "36px" }}
                />

                <div className="absolute bottom-2 right-2">
                  {aiLoader ? (
                    <div className="bg-orange-500 text-white p-2 rounded-full cursor-not-allowed flex items-center justify-center">
                      <span className="animate-spin h-5 w-5 border-2 border-t-transparent border-white rounded-full"></span>
                    </div>
                  ) : (
                    <button
                      onClick={generateCoverLetter}
                      className="bg-orange-500 hover:bg-orange-600 text-white p-2 rounded-full cursor-pointer flex items-center justify-center"
                    >
                      <ArrowUp size={20} />
                    </button>
                  )}
                </div>
              </div>
              {/*  */}
            </div>
          </div>
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
                  Our career counselors have created a simple, ready-to-use
                  cover letter template. Just copy, paste, and replace the
                  bracketed sections with your own details
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
          {/*  */}
        </div>
      )}
    </>
  );
}
