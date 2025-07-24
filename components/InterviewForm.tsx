"use client";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import CreatableSelect from 'react-select/creatable';
import Select from "react-select"; // not CreatableSelect
// import { StylesConfig, GroupBase } from 'react-select';

// Define these interfaces if they are not imported from a shared types file (recommended)
interface User {
  address: string;
  authProvider: string;
  bio: string;
  city: string;
  company: string;
  country: string;
  createdAt: string;
  email: string;
  gstin: string;
  id: string;
  linkedin: string;
  name: string;
  packs: string;
  phone: string;
  photoURL: string;
  state: string;
  zip: string;
}

interface Roles {
  id: string;
  role: string;
  createdAt: string;
  flag: boolean;
  skillsetNames?: string[]; // array of skill *names*, not IDs
}

interface Skills {
  id: string;
  skill: string;
  createdAt: string;
  flag: boolean;
}

interface InterviewFormProps {
  user: User | null;
  roles: Roles[];
  skills: Skills[];
}

// Define the type for react-select options (including creatable ones)
interface SelectOption {
  value: string;
  label: string;
  __isNew__?: boolean;
  data?: Roles; // Store full role object
}

export default function InterviewForm({ user, roles, skills }: InterviewFormProps) {
  const [questionCount, setQuestionCount] = useState<number | "">("");
  const [selectedRole, setSelectedRole] = useState<SelectOption | null>(null);
  const [selectedSkills, setSelectedSkills] = useState<SelectOption[]>([]);
  const [type, setType] = useState("");
  const [level, setLevel] = useState("");
  const [generateStatus, setGenerateStatus] = useState(false);

  // Validation states
  const [isRoleInvalid, setIsRoleInvalid] = useState(false);
  const [isTypeInvalid, setIsTypeInvalid] = useState(false);
  const [isLevelInvalid, setIsLevelInvalid] = useState(false);
  const [isSkillsInvalid, setIsSkillsInvalid] = useState(false);
  const [isQuestionCountInvalid, setIsQuestionCountInvalid] = useState(false);

  

  // Transform roles data into react-select options format
  const roleOptions: SelectOption[] = roles.map((r) => ({
  value: r.id,
  label: r.role,
  data: r, // store full role data including skillsetNames
}));

  // Transform skills data into react-select options format
  const skillOptions: SelectOption[] = skills.map((s) => ({
    value: s.id,
    label: s.skill,
  }));

  const handleSubmit = async () => {
    let isValid = true;

    // Reset all validation states
    setIsRoleInvalid(false);
    setIsTypeInvalid(false);
    setIsLevelInvalid(false);
    setIsSkillsInvalid(false);
    setIsQuestionCountInvalid(false);

    // Perform validation and set invalid states
    if (!selectedRole) {
      setIsRoleInvalid(true);
      isValid = false;
    }
    if (!type) {
      setIsTypeInvalid(true);
      isValid = false;
    }
    if(!level) {
      setIsLevelInvalid(true);
      isValid = false;
    }
    // if (selectedSkills.length === 0) {
    //   setIsSkillsInvalid(true);
    //   isValid = false;
    // }
    if (!questionCount) {
      setIsQuestionCountInvalid(true);
      isValid = false;
    }

    // Log validation states for debugging
    console.log("Validation States:");
    console.log("isRoleInvalid:", isRoleInvalid);
    console.log("isTypeInvalid:", isTypeInvalid);
    console.log("isLevelInvalid:", isLevelInvalid);
    console.log("isSkillsInvalid:", isSkillsInvalid);
    console.log("isQuestionCountInvalid:", isQuestionCountInvalid);
    console.log("Overall isValid:", isValid);


    if (!isValid) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setGenerateStatus(true);

    toast.loading("Generating your interview questions...", {
      duration: 10000,
      id: "generate-toast",
    });

    try {
      const response = await fetch("https://app.winyourinterview.ai/api/vapi/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          role: selectedRole?.label,
          type: type,
          level: level,
          amount: String(questionCount || 1),
          userid: user?.id || "guest",
          techstack: selectedSkills.map(s => s.label).join(", "),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to generate interview questions");
      }

      toast.success("Interview generated successfully! 🎉", {
        duration: 7000,
        id: "generate-toast",
      });
      window.location.href = "/";

    } catch (error) {
      console.error(error);
      toast.error("Failed to generate interview questions.");
    } finally {
      setGenerateStatus(false);
    }
  };

  const commonFieldClasses =
    "w-full p-2 pr-10 rounded-md border border-gray-300 dark:border-gray-700 bg-gray-900 text-white appearance-none";

  // Custom styles for react-select to match Tailwind dark theme
  // Now accepts an isInvalid prop
  const getCustomSelectStyles = (isInvalid: boolean) => ({
    control: (base: any, state: any) => ({
      ...base,
      backgroundColor: '#1A202C', // bg-gray-900
      borderColor: isInvalid ? '#EF4444' : '#4A5568', // border-red-500 or border-gray-700
      color: 'white',
      borderRadius: '0.375rem', // rounded-md
      padding: '0.25rem', // p-2
      boxShadow: state.isFocused ? '0 0 0 1px #63B3ED' : 'none', // Example focus ring
      '&:hover': {
        borderColor: isInvalid ? '#EF4444' : '#63B3ED', // Maintain red on hover if invalid
      },
      minHeight: '42px', // Ensure consistent height for single and multi-select
    }),
    multiValue: (base: any) => ({
      ...base,
      backgroundColor: '#3B82F6', // bg-blue-500
      color: 'white',
      borderRadius: '9999px', // rounded-full
      padding: '0.125rem 0.5rem', // px-2 py-1
    }),
    multiValueLabel: (base: any) => ({
      ...base,
      color: 'white',
      fontSize: '0.875rem', // text-sm
    }),
    multiValueRemove: (base: any) => ({
      ...base,
      color: 'white',
      '&:hover': {
        backgroundColor: '#2563EB', // A darker blue on hover
        color: 'white',
      },
    }),
    singleValue: (base: any) => ({
      ...base,
      color: 'white',
    }),
    input: (base: any) => ({
      ...base,
      color: 'white',
    }),
    placeholder: (base: any) => ({
      ...base,
      color: '#A0AEC0', // gray-400
    }),
    menu: (base: any) => ({
      ...base,
      backgroundColor: '#1A202C', // bg-gray-900 for dropdown menu
      color: 'white',
      borderRadius: '0.375rem', // rounded-md
    }),
    option: (base: any, state: any) => ({
      ...base,
      backgroundColor: state.isFocused ? '#2D3748' : '#1A202C', // bg-gray-800 on focus, bg-gray-900 otherwise
      color: 'white',
      '&:active': {
        backgroundColor: '#4A5568', // bg-gray-700 on active
      },
    }),
    indicatorSeparator: (base: any) => ({
      ...base,
      backgroundColor: '#4A5568', // Separator color
    }),
    dropdownIndicator: (base: any) => ({
      ...base,
      color: '#A0AEC0', // Arrow color
      '&:hover': {
        color: 'white',
      },
    }),
  });

  return (
    <>
      <div className="flex-center flex-col gap-4 p-7 blue-gradient-dark rounded-lg border-2 border-primary-200/50 w-full max-w-2xl mx-auto">
        <div className="w-full flex flex-row justify-between">
         <button
         onClick={() => window.history.back()}
          className="w-fit flex flex-row items-center cursor-pointer"
        >
          <ArrowLeft color="#ffffffc2" size={21} />
          <p className="text-[#ffffffc2] ml-1">Back</p>
        </button>
          <h3 className="text-xl font-bold text-white">Interview Generation</h3>
          {/* If file.svg is a local asset, import it and use <Image> component.
              If it's a public asset in the /public folder, the path should be relative to /public. */}
          <img src="/file.svg" alt="File icon" height={20} width={20} className="hidden sm:block" />
        </div>

        <div className="flex flex-col gap-2 w-full">
          <label className="text-white font-medium">Role</label>
          <Select
  className="basic-single"
  classNamePrefix="select"
  value={selectedRole}
  onChange={(selectedOption) => {
    setSelectedRole(selectedOption as SelectOption);
    setIsRoleInvalid(false);

    const skillNamesFromRole = selectedOption?.data?.skillsetNames || [];
    const matchedSkills = skillNamesFromRole.map((name) => {
      const match = skills.find((s) => s.skill.toLowerCase() === name.toLowerCase());
      return match ? { value: match.id, label: match.skill } : null;
    }).filter(Boolean) as SelectOption[];

    setSelectedSkills(matchedSkills);
  }}
  options={roleOptions}
  isClearable={true}
  isSearchable={true}
  placeholder="Select a Role"
  styles={getCustomSelectStyles(isRoleInvalid)}
/>
        </div>
    {/* Tech Stack (Skills) */}
        <div className="flex flex-col gap-2 w-full">
          <div>
           <label className="text-white font-medium">Skills to be evaluated</label>
              <p className="text-sm text-gray-400">
                These skills are based on the selected role and cannot be modified.
              </p>
          </div>
         <div style={{ position: "relative" }}>
        <CreatableSelect
          className="basic-multi-select"
          classNamePrefix="select"
          isMulti
          isDisabled={true}
          value={selectedSkills}
          onChange={(selectedOptions) => {
            setSelectedSkills(selectedOptions as SelectOption[]);
            setIsSkillsInvalid(false);
          }}
          options={skillOptions}
          isClearable={true}
          isSearchable={true}
          placeholder="Skills are auto-selected from role"
          styles={getCustomSelectStyles(isSkillsInvalid)}
        />

        {/* Overlay for alert on click */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            cursor: "not-allowed",
            zIndex: 10, // above select but below any modal
          }}
          onClick={() => {
            if (!selectedRole) {
              alert("Please select a role first to load skills.");
            }
          }}
        />
      </div>
        </div>
        {/* Interview Type */}
        <div className="flex flex-col gap-2 w-full">
          <label className="text-white font-medium">Interview Type</label>
          <div className="relative">
            <select
              className={`${commonFieldClasses} pl-3 pr-10 ${isTypeInvalid ? '!border-red-500' : ''}`}
              value={type}
              onChange={(e) => {
                setType(e.target.value);
                setIsTypeInvalid(false); // Clear validation on change
              }}
            >
              <option value="">Select Interview Type</option>
              <option value="behavioural">Behavioural</option>
              <option value="technical">Technical</option>
              <option value="mixed">Mixed</option>
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

        {/* Experience Level */}
        <div className="flex flex-col gap-2 w-full">
          <label className="text-white font-medium">Experience Level</label>
          <div className="relative">
            <select
                className={`${commonFieldClasses} pl-3 pr-10 ${isLevelInvalid ? '!border-red-500' : ''}`}
                value={level}
                onChange={(e) => {
                  setLevel(e.target.value);
                  setIsLevelInvalid(false); // Clear validation on change
                }}
              >
                <option value="">Select Experience Level</option>
                <option value="Entry Level">Entry Level (Typically less than 2 years)</option>
                <option value="Junior Level">Junior Level (Typically 2-5 years)</option>
                <option value="Mid-Level">Mid-Level / Intermediate (Typically 5-7 years)</option>
                <option value="Senior Level">Senior Level (Typically 7-10 years)</option>
                <option value="Advanced Level">Advanced Level (Typically 10-15 years)</option>
                <option value="Expert Level">Expert Level (Typically 15-20 years)</option>
                <option value="Mastery Level">Mastery Level (20+ years)</option>
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

    

        {/* Number of Questions */}
        <div className="flex flex-col gap-2 w-full">
          <label className="text-white font-medium">Number of Questions</label>
          <div className="relative">
            <select
              value={questionCount}
              onChange={(e) => {
                setQuestionCount(Number(e.target.value));
                setIsQuestionCountInvalid(false); // Clear validation on change
              }}
              className={`${commonFieldClasses} pl-3 pr-10 ${isQuestionCountInvalid ? '!border-red-500' : ''}`}
            >
              <option value="" disabled>
                Select Number of Questions
              </option>
              {[...Array(10)].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}
                </option>
              ))}
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

        <button onClick={handleSubmit} className="px-10 bg-green-500 hover:bg-green-700 text-white font-medium py-2 rounded-md mt-4 transition">
          {generateStatus ? <span className="dots-loading">. . .</span> : "Create Interview"}
        </button>
      </div>
    </>
  );
}
