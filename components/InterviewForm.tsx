"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { X } from "lucide-react";
import { toast } from "sonner";

export default function InterviewForm({ user }) {
    const [techInput, setTechInput] = useState<string>("");
    const [techStack, setTechStack] = useState<string[]>([]);
    const [questionCount, setQuestionCount] = useState<number | "">("");
    const [role, setRole] = useState("");
    const [type, setType] = useState("");
    const [level, setLevel] = useState("");
    const [generateStatus, setGenerateStatus] = useState(false);

    const router = useRouter();  // <-- useRouter hook here

    const handleTechInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTechInput(e.target.value);
    };

    const removeTech = (techToRemove: string) => {
        const newTags = techInput
            .split(",")
            .map((tag) => tag.trim())
            .filter((tag) => tag && tag.toLowerCase() !== techToRemove.toLowerCase());

        setTechInput(newTags.join(", "));
    };

    const parsedTechStack = techInput
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);

    const handleSubmit = async () => {
        if (!role || !type || !level || techInput.length === 0 || !questionCount) {
            toast.error("Please fill in all fields.");
            return;
        }

        setGenerateStatus(true);

        toast.loading("Generating your interview questions...", {
            duration: 10000,
            id: "generate-toast",
        });

        try {
            const response = await fetch("https://ai-interviewer-pi-three.vercel.app/api/vapi/generate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    role: role,
                    type: type,
                    level: level,
                    amount: String(questionCount || 1), // fallback or throw validation earlier
                    userid: user?.id || "guest",
                    techstack: techInput,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to generate interview questions");
            }

            // console.log("Generated questions:", data);

            toast.success("Interview generated successfully! 🎉", {
                duration: 5000,
                id: "generate-toast",
            });

            // Redirect to "/" after successful generation
            router.push("/"); // <-- redirect here

        } catch (error) {
            console.error(error);
            toast.error("Failed to generate interview questions.");
        } finally {
            setGenerateStatus(false);
        }
    };

  
  
  






  const commonFieldClasses =
    "w-full p-2 pr-10 rounded-md border border-gray-300 dark:border-gray-700 bg-gray-900 text-white appearance-none";

  return (
    <div className="flex-center flex-col gap-4 p-7 blue-gradient-dark rounded-lg border-2 border-primary-200/50 w-full max-w-2xl mx-auto">
      <h3 className="text-xl font-semibold text-white">Interview Generation</h3>

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

      {/* Interview Type */}
      <div className="flex flex-col gap-2 w-full">
        <label className="text-white font-medium">Interview Type</label>
        <div className="relative">
        <select
        className={`${commonFieldClasses} pl-3 pr-10`}
        value={type}
        onChange={(e) => setType(e.target.value)}
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

     {/* Tech Stack */}
     <div className="flex flex-col gap-2 w-full">
      <div>
  <label className="text-white font-medium">Skills to be evaluated</label>
  <p className="text-sm text-gray-400">
    Please enter skills separated by commas (e.g., Advanced Excel, Python, Java, etc.)
  </p>
  </div>
  <input
    type="text"
    value={techInput}
    onChange={handleTechInput}
    placeholder="e.g., Advanced Excel, Python, Java, etc."
    className={commonFieldClasses}
  />
  <div className="flex flex-wrap gap-2 mt-2">
    {parsedTechStack.map((tech, idx) => (
      <span
        key={idx}
        className="flex items-center gap-1 px-3 py-1 bg-blue-500 text-white text-sm rounded-full"
      >
        {tech}
        <X
          className="w-4 h-4 cursor-pointer"
          onClick={() => removeTech(tech)}
        />
      </span>
    ))}
  </div>
</div>


      {/* Number of Questions */}
      <div className="flex flex-col gap-2 w-full">
        <label className="text-white font-medium">Number of Questions</label>
        <div className="relative">
        <select
        value={questionCount}
        onChange={(e) => setQuestionCount(Number(e.target.value))}
        className={`${commonFieldClasses} pl-3 pr-10`}
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
      {generateStatus? <span className="dots-loading">. . .</span> : "Create Interview"}
      </button>
    </div>
  );
}
