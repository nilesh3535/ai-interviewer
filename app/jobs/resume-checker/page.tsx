'use client';
import { useEffect, useState } from 'react';
import { Lock,Upload   } from 'lucide-react';
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";


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
      'Hard Skills': string;
      'Soft Skills': string;
      'Keyword Density': string;
    };
    content: {
      'ATS Parse Rate': string;
      'Spelling & Grammar': string;
      'Quantifiable Results': string;
    };
    sections: {
      'Contact Information': string;
      'Professional Summary': string;
      'Skills': string;
      'Experience': string;
      'Education': string;
    };
    style: {
      'Font Style': string;
      'Email Format': string;
      'Active Voice': string;
      'Bullet Points': string;
    };
  };
}

export default function ResumeCheckerPage() {
  const [parsedText, setParsedText] = useState('');
const [n8nData, setN8nData] = useState<ResumeAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [scoreLoader, setScoreLoader] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    setLoading(true);
    try {
      const res = await fetch('/api/parse-pdf', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('Failed to parse PDF');
      const data = await res.json();
      setParsedText(data.text);

      const webhookRes = await fetch(
        'https://n8n.panalinks.com/webhook/7e8a6934-9faf-4049-bee7-6f8b8add5f7b',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ resumeParsedText: data.text }),
        }
      );

      if (!webhookRes.ok) {
        console.warn('Webhook call failed');
        return;
      }

      const webhookData = await webhookRes.json();
      console.log('here', webhookData);
setScoreLoader(true);
setTimeout(() => {
  setScoreLoader(false);
  setStepsLoader(true)
  setN8nData(webhookData); // ✅ no array

}, 3000);
    } catch (err) {
      console.error('Error:', err);
      alert('Error parsing or sending data.');
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
  const [stepsloader,setStepsLoader]=useState(false);
  const [stepsStopped,setSteppsStopper]=useState(false);
  useEffect(() => {
    if(stepsloader){
    if (currentStep < steps.length) {
      const timer = setTimeout(() => {
        setCurrentStep((prev) => prev + 1);
      }, 3000); // 3 seconds per step
      return () => clearTimeout(timer);
    }else{
      setStepsLoader(false)
      setSteppsStopper(true)
    }
  }
  }, [currentStep,stepsloader]);
 const [expanded, setExpanded] = useState<string | null>(null);

  const toggle = (key: string) => {
    setExpanded(expanded === key ? null : key);
  };

  const getBadgeColor = (score: number) => {
    return score == 100
      ? "bg-green-100 text-green-700"
      : "bg-orange-100 text-orange-600";
  };
  return (
    <div>
      {scoreLoader ? (
        <div className="bg-white min-h-screen flex justify-center items-center">
          <span className="loading loading-infinity text-green-500" style={{ width: '70px', height: '70px' }} />

        </div>
      ) :n8nData ?(
         <div className="min-h-screen bg-gray-50 flex justify-center items-center px-4 py-10">
     <div className="flex flex-col lg:flex-row w-full max-w-7xl rounded-2xl shadow-lg overflow-hidden">
        
        {/* Left Panel */}
        <div className="w-full lg:w-1/3 bg-white p-8 border-b lg:border-b-0 lg:border-r">
         <h2 className="text-xl font-semibold text-gray-800 mb-5 text-center">Your Score</h2>
        {/* Animation */}
        {stepsloader ?
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
           :<>
        <div className="text-center mb-1 text-3xl font-bold text-orange-400">{n8nData.overallScore}/100</div>
        
         <div className="space-y-2 mt-5">
            <div className="flex justify-between">
    <p className="text-sm font-semibold text-gray-600">Result:</p>
    <p className={`text-sm font-semibold  ${n8nData.verdict.toLowerCase()=="fail"?"text-red-600":"text-green-600"}`}>{n8nData.verdict}</p>
  </div>


  <div className="">
    <p className="text-sm font-semibold text-gray-600">Reason:</p>
    <p className="text-sm text-orange-600">{n8nData.reason}</p>
  </div>
    <div className="flex justify-between">
    <p className="text-sm font-semibold text-gray-600">Issues:</p>
    <p className="text-sm text-red-600">{n8nData.issueCount}</p>
  </div>
</div>
        </>
}

      <hr className="border-gray-200 my-4" />
        
         {stepsloader ? <div className="space-y-4">
            {["Tailoring", "Content", "Section", "ATS Essentials","style"].map((label) => (
              <div key={label} className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-600 uppercase">{label}</span>
                <div className="skeleton w-20 h-3 bg-gray-200 rounded-full"></div>
              </div>
            ))}
          </div>
          :
           <div className="space-y-6 ">
      {Object.entries(n8nData.scoreBreakdown).map(([category, score]) => {
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
                <span className="text-sm font-medium text-gray-600 uppercase">{category}</span>
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
              n8nData.subcategories[category as keyof typeof n8nData.subcategories] &&
              Object.entries(
                n8nData.subcategories[
                  category as keyof typeof n8nData.subcategories
                ]
              ).map(([subName, subScore]) => (
                <div key={subName} className="pl-4 mt-3 space-y-1">
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
      })}
    </div>
}
          {/*  */}
  <hr className="border-gray-200 my-6" />

   
         {stepsloader ? 
         <button
            className="animate-pulse mt-6 w-full bg-gray-200 text-gray-400 font-semibold py-2 rounded-lg cursor-not-allowed text-sm flex items-center justify-center space-x-2"
            disabled
          >
           Updating your resume skills
          </button>
          :
             <button
              onClick={()=>{
                setN8nData(null)
                setCurrentStep(0)
                setScoreLoader(false);
              }}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded-lg text-sm flex items-center justify-center space-x-2">
        <span>Upload new file</span>
       <Upload  />
      </button>
}
        </div>

        {/* Right Panel */}
       <div className="w-full lg:w-2/3 bg-indigo-50 p-8">
           <ul className="space-y-6 text-gray-700 text-lg">
      {steps.map((step, index) => (
        <li
          key={step}
          className={`flex items-center space-x-3 ${
            index === currentStep ? "text-purple-400" : "text-[#2d3639]"
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
        </div>
      </div>
    </div>
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
               Get instant feedback with our free AI tool — it performs vital checks to help you get more interview calls.
              </p>
              <form className="border border-green-500 border-dashed rounded-lg max-w-md w-full p-8 flex flex-col items-center gap-4">
                {loading && (
                  <>
                    <span className="loading loading-ring  text-green-500 text-center"  style={{ width: '50px', height: '50px' }} />
                    <p className="text-gray-600 font-medium">We are scanning your file.</p>
                  </>
                )}
                <p className="text-gray-700 text-center text-sm leading-5">
                  Drag and drop your resume or click to upload.
                  <br />
                  Supported formats: PDF & DOCX | Max file size: 2MB
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
                src="https://storage.googleapis.com/a1aa/image/c2169f80-5431-49d9-8336-b3abc476632d.jpg"
                alt="Resume checker dashboard"
                className="w-full h-auto object-contain"
                width={900}
                height={500}
              />
            </div>
          </div>
        </div>
      )}

      <div>
 
            </div>
    </div>
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
          <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </div>
  );
} 
