'use client';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { getRegisterInterview } from '@/lib/actions/general.action';
import { useParams } from 'next/navigation';
import Lottie, { LottieComponentProps } from "lottie-react";
import { getCurrentUser,registerMeByOpening } from '@/lib/actions/auth.action';
import Link from "next/link";
import { MetalButton } from '@/components/MetalButton';
import Image from "next/image";
import { cn, getRandomInterviewCover, getTechLogos } from "@/lib/utils";
import Footer from '@/components/Footer';
export default function RegisterPage() {
  const params = useParams();
  const [registerInterview, setRegisterInterview] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
   const [animationData, setAnimationData] = useState<LottieComponentProps["animationData"] | null>(null);
  const [user, setUser] = useState<any>(null);
  const [normalizedType,setNormalizedType] = useState<string>('');
 const [typeBadgeColor,setTypeBadgeColor] = useState<string>('bg-violet-600');
 const [levelBadgeColor,setLevelBadgeColor] = useState<string>('bg-green-600');
const [imgSrc,setImageSrc] = useState<string>('');
const [techIcons,setTechIcons] = useState<any[]>([]);
const [isRegistering, setIsRegistering] = useState(false);
const [successMessage, setSuccessMessage] = useState<string | null>(null);
  useEffect(() => {
    const loadAnimation = async () => {
      const res = await fetch("/loader.json");
      const json = await res.json();
      setAnimationData(json);
    };

    const fetchUserAndInterview = async () => {
      const userData = await getCurrentUser(); // works if getCurrentUser is a fetch call
      setUser(userData);

      if (params?.id) {
        const data = await getRegisterInterview(params.id as string);
        setRegisterInterview(data || []);
     
        if(data && data.length > 0) {
          const interviewType = data[0].type;
          const nType = /mix/gi.test(interviewType) ? "Mixed" : interviewType;
          setNormalizedType(nType);
          setTypeBadgeColor(
            {
              Behavioral: "bg-light-800",
              Mixed: "bg-yellow-600",
              Technical: "bg-blue-600",
            }[nType] || "bg-violet-600"
          );
          const herelevelBadgeColor = {
            "entry level": "bg-emerald-600",
            beginner: "bg-teal-600",
            junior: "bg-lime-600",
            "mid to senior": "bg-amber-500",
            senior: "bg-orange-500",
            advanced: "bg-sky-600",
            expert: "bg-indigo-600",
          }[data[0].type?.toLowerCase() || "beginner"] || "bg-green-600";
          setLevelBadgeColor(herelevelBadgeColor);
          setImageSrc(data[0].coverImage || getRandomInterviewCover());
          const techImgs = await getTechLogos(data[0].techstack);
          setTechIcons(techImgs);
        }
      }

      setIsLoading(false);
    };

    loadAnimation();
    fetchUserAndInterview();
  }, [params?.id]);


  const handleRegister = async (interviewId: string) => {
    if (!user?.id) return;
    setIsRegistering(true);
    try {
      await registerMeByOpening(interviewId, user.id);
      const startDate = moment(registerInterview[0].createdAt)
        .format('MMM D, YYYY hh:mm A');
      setSuccessMessage(
        `Thank you for registering! Your interview starts on ${startDate}. We’ll notify you by email.`
      );
      // Optionally update local state:
      setRegisterInterview(prev => {
        const clone = [...prev];
        clone[0].candidates = [...(clone[0].candidates || []), user.id];
        return clone;
      });
    } finally {
      setIsRegistering(false);
    }
  };

  if (isLoading || !animationData) {
    return (
      <div className="fixed inset-0 z-50 bg-[#171950] dark:bg-white/5 text-white">
        <div className="relative flex lg:flex-row w-full h-screen justify-center flex-col sm:p-0">
          <div className="lg:w-1/2 w-full h-full lg:grid items-center hidden">
            <div className="relative items-center justify-center flex z-1 flex-col gap-4">
              <Lottie animationData={animationData} loop autoplay className="w-48 h-48" />
            </div>
          </div>
          <div className="lg:hidden flex justify-center items-center w-full h-full bg-[#171950] dark:bg-white/5">
            <Lottie animationData={animationData} loop autoplay className="w-48 h-48" />
          </div>
        </div>
      </div>
    );
  }

  
   
  
    
    const interview = registerInterview[0];
  const alreadyRegistered = Boolean(
    interview?.candidates?.includes(user?.id)
  );

  
  return (
    <div className="">
      {registerInterview && registerInterview.length > 0 ? (
  <div className="flex flex-col gap-6 mt-8">
   {successMessage ? <h4 className="w-full text-center text-green-500 font-medium">{successMessage}</h4>
   : alreadyRegistered ? (
    <p className="text-green-500 text-center">Hello <span className="text-primary-200">{user?.name?.split(" ")[0] || 'User'}</span>, You have already registered for this interview.</p>
    ) : <h4 className='w-full text-center'>
    Hello <span className="text-primary-200">{user?.name?.split(" ")[0] || 'User'}</span>, you are invited to register for your upcoming interview.
    </h4>
}
    <div className='flex flex-row items-center justify-center w-full'>
    {registerInterview.map((interview,index) => (
       <div key={index} className="card-border w-[400px] max-sm:w-full min-h-96">
       <div className="card-interview">
         <div>
           {/* Type Badge - Top Right */}
           <div
             className={cn(
               "absolute top-0 right-0 w-fit px-4 py-2 rounded-bl-lg z-10",
               typeBadgeColor
             )}
           >
             <p className="badge-text font-medium text-white">{normalizedType}</p>
           </div>
 
           {/* Level Badge - Top Left */}
           <div
             className={cn(
               "absolute top-0 left-0 w-fit px-4 py-2 rounded-br-lg z-10",
               levelBadgeColor
             )}
           >
             <p className="badge-text font-medium text-white capitalize">{interview?.level || "Beginner"}</p>
           </div>
 
           {/* Cover Image */}
           <Image
             src={imgSrc}
             alt="cover-image"
             width={90}
             height={90}
             className="rounded-full object-fit size-[90px] mt-6 mx-auto"
           />
 
           {/* Interview Role */}
           <h3 className="my-5 capitalize ">{interview.role.toLowerCase().includes("interview") ? interview.role : `${interview.role} Interview`}</h3>
 
           {/* Date & Score & Questions Count */}
           <div className="flex flex-row items-center justify-between mt-3">
             <div className="flex flex-row gap-2">
               <Image
                 src="/calendar.svg"
                 width={22}
                 height={22}
                 alt="calendar icon"
               />
               <p>
               
                  {
                  moment(interview.createdAt).format("MMM D, YYYY hh:mm A")
                  }</p>
             </div>
 
            
             
             <div className="flex flex-row gap-2 items-center">
               <Image 
                 src="/question.svg" 
                 width={22} 
                 height={22} 
                 alt="question icon" 
               />
               <p>
               <span className="font-semibold">{interview?.questions?.length || "---"}</span> Questions
               </p>
             </div>
           </div>
           <p className="line-clamp-2 mt-5">
            Techstack: {interview.techstack.join(", ")}
            </p>
           {/* Feedback or Placeholder Text */}
           <p className="line-clamp-2 mt-5">
                Registration closes on{" "}
                <span className="font-semibold">May 10, 2025 at 9:00 AM</span>.
                </p>
         </div>
 
         <div className="flex flex-row justify-between">
          {/* icons */}
         <div className="flex flex-row items-center">
               {techIcons.slice(0, 3).map(({ tech, url }, index) => (
                 <div
                   key={tech}
                   className={cn(
                     "relative group bg-dark-300 rounded-full p-2 flex flex-center",
                     index >= 1 && "-ml-3"
                   )}
                 >
                   <span className="tech-tooltip">{tech}</span>
         
                   <Image
                     src={url}
                     alt={tech}
                     width={100}
                     height={100}
                     className="size-5"
                   />
                 </div>
               ))}
             </div>
          {/*  */}
          <div className="mt-6 flex justify-center">
          {successMessage ? (
            <></>
            ) : alreadyRegistered ? (
            <p className="text-gray-500 text-center">Already Registered</p>
            ) : (
            <MetalButton
                variant="primary"
                onClick={() => handleRegister(interview.id)}
                disabled={isRegistering}
            >
                {isRegistering ? 'Registering…' : 'Register now'}
            </MetalButton>
            )}
        </div>
         </div>
       </div>
     </div>
    ))}
  </div>
  </div>
) : (
  'This link has expired'
)}
  <Footer />
    </div>
  );
}
