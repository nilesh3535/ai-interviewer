"use client";

import Image from "next/image";
import { useState, useEffect, useCallback,useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { vapi } from "@/lib/vapi.sdk";
import { interviewer } from "@/constants";
import { createFeedback } from "@/lib/actions/general.action";
import CallHint from "@/components/CallHint";
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { HelpCircle,TriangleAlert  } from 'lucide-react';
import { insertTransaction, updateWallet } from "@/lib/actions/auth.action";
import moment from "moment";

enum CallStatus {
  INACTIVE = "INACTIVE",
  CONNECTING = "CONNECTING",
  ACTIVE = "ACTIVE",
  FINISHED = "FINISHED",
}

interface SavedMessage {
  role: "user" | "system" | "assistant";
  content: string;
}

const Agent = ({
  userName,
  userId,
  interviewId,
  feedbackId,
  type,
  questions,
  userAvatar,
  remaining,
  interviewrole
}: AgentProps) => {
  const router = useRouter();




    const accept = () => {
      if(parseInt(remaining) > 0){
       toast.success("Awesome! Your AI interview is about to begin...",{
          duration: 2500,
          id: "feedback-toast",
        });
        handleCall()
      }else{
        toast.warning("You don't have enough credits. Please purchase a pack to start your interview",{
          duration:5000
        });
        // router.push(`/packs`);
        setTimeout(()=>{
        confirmAddCredit()
        },1000)
        //
      }
    };

    const reject = () => {
         toast("Interview cancelled. You can start it anytime from here.", {
          icon: "🛑",
          duration: 2500,
        });
    };

    const confirmInterview = () => {
        confirmDialog({
            group: 'headless',
            message: 'Are you sure you want to proceed?',
            header: 'Confirmation',
            icon: 'pi pi-exclamation-triangle',
            defaultFocus: 'accept',
            accept,
            reject
        });
    };

    const confirmAddCredit = () => {
        confirmDialog({
            group: 'headless',
            message: 'Please add credits to proceed interview',
            header: 'Credits',
            icon: 'pi pi-exclamation-triangle',
            defaultFocus: 'accept',
            accept,
            reject
        });
    };





  const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
  const [messages, setMessages] = useState<SavedMessage[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [lastMessage, setLastMessage] = useState<string>("");
  const [showCallHint, setShowCallHint] = useState(true);
  const [lastActivityTimestamp, setLastActivityTimestamp] = useState<number>(Date.now());
  const INACTIVITY_TIMEOUT = process.env.NEXT_PUBLIC_VAPI_INACTIVITY_TIMEOUT 
                            ? parseInt(process.env.NEXT_PUBLIC_VAPI_INACTIVITY_TIMEOUT) 
                            : 10000; // time of inactivity will end the call
  // Add question tracking
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const totalQuestions = questions?.length || 0;

  const handleDisconnect = useCallback(() => {
    setCallStatus(CallStatus.FINISHED);
    vapi.stop();
  }, []);
const areYouTherePromptCount = useRef(0); // persists across renders and interval calls
const promptCountRef = useRef(0); // This always has the latest value
const MAX_PROMPTS = 3;
  // Inactivity monitor
  useEffect(() => {
    if (callStatus !== CallStatus.ACTIVE) return;
    
    const inactivityTimer = setInterval(() => {
      const now = Date.now();
      // old code
      // if (now - lastActivityTimestamp > INACTIVITY_TIMEOUT) {
      //   console.log("Inactivity timeout reached, ending call");
      //   handleDisconnect();
      // }

          // new
      
          if (now - lastActivityTimestamp > INACTIVITY_TIMEOUT) {

      console.log("Current prompt count:", areYouTherePromptCount.current);

     if (areYouTherePromptCount.current === 0) {
  // 1st prompt
        vapi.send({
          type: 'add-message',
          message: {
            role: 'system',
            content: `Hello ${userName}, are you there?`,
          },
        });
        areYouTherePromptCount.current++;
        setLastActivityTimestamp(Date.now());
      } else if (areYouTherePromptCount.current === 1) {
        // 2nd prompt
       vapi.send({
          type: 'add-message',
          message: {
            role: 'system',
            content: `Hello ${userName}, are you there?`,
          },
        });
        areYouTherePromptCount.current++;
        setLastActivityTimestamp(Date.now());
      }else if (areYouTherePromptCount.current === 2) {
        // 2nd prompt
       vapi.send({
          type: 'add-message',
          message: {
            role: 'system',
            content: `I didn't hear anything. If you're facing any issues, please try again later. only say this not anything other`,
          },
        });
        areYouTherePromptCount.current++;
        setLastActivityTimestamp(Date.now());
      } else if (areYouTherePromptCount.current === 3) {
        // Final polite closing
        vapi.send({
          type: 'add-message',
          message: {
            role: 'system',
              content: `It seems there might be a connection issue. Please try again later. Have a great day! I'm ending the interview now. only say this not anything other`,
          },
        });
        areYouTherePromptCount.current++;
        setLastActivityTimestamp(Date.now());

        // End the call after a short pause (optional)
        setTimeout(() => {
          console.log("Inactivity timeout reached, ending call");
          handleDisconnect();
        }, 4000); // wait 4 seconds before ending
      } else {
        // Safety fallback (shouldn't be needed)
        handleDisconnect();
      }
      }


    }, 5000); // Check every 5 seconds
    




    return () => clearInterval(inactivityTimer);
 }, [callStatus, lastActivityTimestamp, handleDisconnect, INACTIVITY_TIMEOUT, userName]);
  
  // VAPI event handlers
  useEffect(() => {
    const onCallStart = () => {
      setCallStatus(CallStatus.ACTIVE);
      setLastActivityTimestamp(Date.now());
       areYouTherePromptCount.current = 0; // ✅ Reset inactivity prompts
    };

    const onCallEnd = () => {
          areYouTherePromptCount.current = 0; // ✅ Reset inactivity prompts
      setCallStatus(CallStatus.FINISHED);
  
    };

    const onMessage = (message: Message) => {
  
      if (message.type === "transcript" && message.transcriptType === "final") {
        setLastActivityTimestamp(Date.now());
       
        const newMessage = { role: message.role, content: message.transcript };
        setMessages((prev) => [...prev, newMessage]);
        
        // Track question progress - only increment counter when AI asks a MAIN question
        // We'll use a more sophisticated approach to identify main questions
        if (message.role === "assistant" && 
            totalQuestions > 0 && 
            currentQuestionIndex < totalQuestions) {
          
          // Check if this message contains a question that matches one of our prepared questions
          if (message.transcript.includes("?") && questions) {
            // Try to match this message with one of our prepared questions
            const isMainQuestion = questions.some(question => {
              // Create a simplified version of both texts for comparison (lowercase, no punctuation)
              const simplifiedTranscript = message.transcript.toLowerCase().replace(/[^\w\s]/g, '');
              const simplifiedQuestion = question.toLowerCase().replace(/[^\w\s]/g, '');
              
              // Check if the transcript contains a significant portion of the question
              // This helps match even if the AI rephrases slightly
              return simplifiedTranscript.includes(simplifiedQuestion.substring(0, Math.min(30, simplifiedQuestion.length)));
            });
            
            if (isMainQuestion) {
              setCurrentQuestionIndex(prev => prev + 1);
              // console.log(`Question ${currentQuestionIndex + 1}/${totalQuestions} asked (matched with prepared question)`);
            }
          }
        }
        
        // Auto-end call when all questions have been asked AND answered
        // Only consider ending after the last question has been asked
        if (currentQuestionIndex >= totalQuestions && totalQuestions > 0) {
          // Only end the call after the user has responded to the last question
          if (message.role === "user") {
            // console.log("All questions completed and user has responded, ending call automatically");
            // Add a longer delay to allow for final exchange and closing remarks
            setTimeout(() => {
              handleDisconnect();
            }, 15000); // 15 second grace period after user's final answer
          }
        }
      }
    };

    const onSpeechStart = () => {
      setLastActivityTimestamp(Date.now()); // Update timestamp when speech starts
      
       
      setIsSpeaking(true);
    };

    const onSpeechEnd = () => {
      setIsSpeaking(false);
    };

    const onError = (error: Error) => {
      console.log("Error:", error);
      
      // More robust error handling for meeting ended errors
      if (
        (typeof error === 'object' && error !== null) && 
        (
          // Check various possible error message formats
          (error.message && error.message.includes("Meeting has ended")) ||
          (error.toString().includes("Meeting has ended")) ||
          (JSON.stringify(error).includes("Meeting has ended"))
        )
      ) {
        // console.log("Detected meeting end, transitioning to FINISHED state");
        setCallStatus(CallStatus.FINISHED);
        vapi.stop(); // Ensure VAPI is properly stopped
      }
    };

    vapi.on("call-start", onCallStart);
    vapi.on("call-end", onCallEnd);
    vapi.on("message", onMessage);
    vapi.on("speech-start", onSpeechStart);
    vapi.on("speech-end", onSpeechEnd);
    vapi.on("error", onError);

    return () => {
      vapi.off("call-start", onCallStart);
      vapi.off("call-end", onCallEnd);
      vapi.off("message", onMessage);
      vapi.off("speech-start", onSpeechStart);
      vapi.off("speech-end", onSpeechEnd);
      vapi.off("error", onError);
    };
  }, [currentQuestionIndex, totalQuestions, handleDisconnect, questions]); 

  // Handle messages and call status changes
  useEffect(() => {
    if (messages.length > 0) {
      setLastMessage(messages[messages.length - 1].content);
    }

    const handleGenerateFeedback = async (messages: SavedMessage[]) => {      
      toast.loading("Generating feedback from your interview...", {
        duration: 5000,
        id: "feedback-toast"
      });

      const { success, feedbackId: id } = await createFeedback({
        interviewId: interviewId!,
        userId: userId!,
        transcript: messages,
        feedbackId,
      });

      if (success && id) {
            const newBalance = (parseInt(remaining) - 1).toString();
            const paymentid = "wallet" + moment(new Date()).format("DDMMYYHHmmss");
            await insertTransaction({
              paymentid:paymentid,
              orderid: String(interviewrole),
              type: "Debited",
              amount: "",
              packs: "1",
              paymentType: "User Wallet", // e.g., card, UPI, netbanking
              oldBalance: remaining,
              remaining: newBalance,
              userId,
              packType:""
            });

            await updateWallet({ packs: newBalance, userId });

            toast.success("Interview completed! Feedback generated successfully.", {
              id: "feedback-toast",
            });

            router.push(`/interview/${interviewId}/feedback`);
      } else {
        console.log("Error saving feedback");
        toast.error("Failed to generate feedback", {
          id: "feedback-toast"
        });
        router.push("/");
      }
    };

    if (callStatus === CallStatus.FINISHED) {
      if (type === "generate") {
        toast.success("Interview generated successfully!", {
          duration: 3000,
          id: "generate-toast"
        });
        router.push("/");
      } else {
        handleGenerateFeedback(messages);
      }
    }
  }, [messages, callStatus, feedbackId, interviewId, router, type, userId]);

  const handleCall = async () => {
    setCallStatus(CallStatus.CONNECTING);

    if (type === "generate") {
      toast.loading("Generating your interview questions...", {
        duration: 10000,
        id: "generate-toast"
      });
      
      await vapi.start(process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID!, {
        variableValues: {
          username: userName,
          userid: userId,
        },
      });
    } else {
      let formattedQuestions = "";
      if (questions) {
        formattedQuestions = questions
          .map((question) => `- ${question}`)
          .join("\n");
      }

      await vapi.start(interviewer, {
        variableValues: {
          questions: formattedQuestions,
        },
      });
    }
  };

    return (
        <>
        <ConfirmDialog
  group="headless"
  content={({ headerRef, contentRef, footerRef, hide, message }) => (
    <div className="flex flex-col items-center px-10 py-5 bg-white shadow-xl rounded-lg max-w-md mx-auto">
      <div className={`${message.header=="Confirmation"?"bg-blue-500":"bg-red-500"} text-white rounded-full p-5 -mt-12`}>
       {message.header=="Confirmation" ? <HelpCircle size={30} className="text-gray-50" />
        :<TriangleAlert size={30} className="text-gray-50" />
        }
        </div>
      <h2 ref={headerRef} className="text-gray-700 font-semibold text-2xl mt-4">
        {message.header}
      </h2>
      {message.header=="Confirmation" ?<p className="text-gray-500 text-center mt-2">
        This interview will use <strong className="text-red-500">1 pack</strong>.
      </p>:
      <p className="text-gray-500 text-center mt-2">
              You don't have enough credits.
      </p>
  }
      {message.header=="Confirmation" ? 
      <p className="text-gray-700 mt-1">Current packs remaining: <strong className="text-green-500">{remaining}</strong></p>
      :
      <p className="text-gray-700 mt-1">Current packs remaining: <strong className="text-red-500">{remaining}</strong></p>
      }
      <p ref={contentRef} className="mt-8 text-gray-700 font-medium text-base text-center">
        {message.message}
      </p>
      <div ref={footerRef} className="w-full flex flex-row justify-around mt-6">
       {message.header=="Confirmation" ?  <button
          type="button"
          className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 font-medium rounded-lg text-sm px-8 py-2.5 text-center me-2 mb-2"
          onClick={(e) => {
            hide(e);
            accept();
          }}
        >
          Proceed
        </button>
         :
        <button
          type="button"
          className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 font-medium rounded-lg text-sm px-8 py-2.5 text-center me-2 mb-2"
          onClick={(e) => {
            hide(e);
            // accept();
             router.push(`/packs`);
          }}
        >
          Add Credits
        </button>
        }
        <button
          type="button"
          className="text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-8 py-2.5 text-center me-2 mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800"
          onClick={(e) => {
            hide(e);
            reject();
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  )}
/>
{/* Error */}

        <div className="call-view">
            {/* AI Interviewer Card */}
            <div className="card-interviewer">
                <div className="avatar">
                    <Image src="/ai-avatar-512.png" alt="AI Avatar" width={110} height={110} className="object-cover" />
                    {isSpeaking && <span className="animate-speak" />}
                </div>
                <h3>AI Interviewer</h3>
            </div>

        {/* User Profile Card */}
        <div className="card-border">
          <div className="card-content">
            <Image
              src={userAvatar || "/user-avatar.jpg"}
              alt="profile-image"
              width={539}
              height={539}
              className="rounded-full object-cover size-[120px]"
            />
            <h3>{userName}</h3>
          </div>
        </div>
      </div>

      {messages.length > 0 && (
        <div className="transcript-border">
          <div className="transcript">
            <p
              key={lastMessage}
              className={cn(
                "transition-opacity duration-500 opacity-0",
                "animate-fadeIn opacity-100"
              )}
            >
              {lastMessage}
            </p>
          </div>
        </div>
      )}

      <div className="w-full flex justify-center relative">
        {callStatus === CallStatus.INACTIVE && showCallHint && (
          <CallHint 
            targetId="call-button"
            timeoutDuration={10000}
            text={type === "generate" ? "Click CALL to generate the interview" : "Click below button to start the interview"}
            onDismiss={() => setShowCallHint(false)}
          />
        )}
        
        {callStatus !== "ACTIVE" ? (
          <button 
            id="call-button" 
            className="relative btn-call" 
            onClick={()=>{
            if(type=="generate"){
            handleCall()
            }else{
              confirmInterview()
            }
            }
            }
          >
            <span
              className={cn(
                "absolute animate-ping rounded-full opacity-75",
                callStatus !== "CONNECTING" && "hidden"
              )}
            />

            <span className="relative">
              {callStatus === "INACTIVE" || callStatus === "FINISHED"
                ? "Start Interview"
                : <span className="dots-loading">. . .</span>}
            </span>
          </button>
        ) : (
          <button className="btn-disconnect cursor-pointer" onClick={() => handleDisconnect()}>
            End
          </button>
        )}
      </div>
    </>
  );
};

export default Agent;
