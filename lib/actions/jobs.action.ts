// lib/jobs.action.ts
// This file will contain client-side data fetching logic.
// It needs "use client" if it uses browser-specific APIs directly,
// but for simple fetch, it's often implied by being imported by a "use client" component.
// Adding "use client" here ensures it's treated as client-side code if this file is imported by a server component.
"use client";

import { toast } from "sonner"; // Assuming sonner is a client-side library


// Define types used by this function
// interface User {
//   id: string;
//   name: string;
//   email: string;
//   photoURL?: string;
//   emailVerified?: boolean;
//   packs?: string;
// }
interface ApplyOption {
  is_direct: boolean;
  publisher: string;
  apply_link: string;
}
interface Job {
  id: number;
  job_id: string;
  search_data: string;
  job_title: string;
  employer_name: string;
  employer_logo: string;
  employer_website: string | null;
  job_publisher: string;
  job_employment_type: string;
  job_employment_types: string[];
  job_apply_link: string;
  job_apply_is_direct: boolean;
  apply_options: ApplyOption[]; // You might want a more specific type here
  job_description: string;
  job_is_remote: boolean;
  job_posted_at: string;
  job_posted_at_timestamp: number;
  job_posted_at_datetime_utc: string;
  job_location: string;
  job_city: string;
  job_state: string;
  job_country: string;
  job_latitude: number;
  job_longitude: number;
  job_benefits: string | null;
  job_google_link: string;
  job_salary: number | null;
  job_min_salary: number | null;
  job_max_salary: number | null;
  job_salary_period: string | null;
  job_highlights: string | null;
  job_onet_soc: number;
  job_onet_job_zone: number;
  candidate_id: string;
  created_date: string;
}

interface GetJobsParams {
   userId:string;
  role: string;
  city: string;
  level: string;
}

export const fetchAndProcessJobs = async ({
 userId,
      role,
      city,
      level,
}: GetJobsParams) => {
  
  try {
    const response = await fetch("http://67.217.62.107/webhook/cbae3c40-0050-4cda-ae1a-301a758ffb02", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userid: userId, position: role, location: city, experience: level }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }

    const data = await response.text();
    // console.log("API Response:", data);



    // Consider if window.location.reload() is truly necessary here.
    // If onSuccess updates the state correctly, the UI should re-render without a full page reload.
    // If you need a full refresh, keep it, but it's generally avoided for SPA-like behavior.
    // window.location.reload();
    return JSON.parse(data);

  } catch (error) {
    console.error("Error fetching jobs:", error);
   return [];
  
  } finally {
    
  }
};

interface FetchUserDataAndJobsParams {
 userId: string;
}

export const fetchUserDataAndJobs = async ({
  userId,
}: FetchUserDataAndJobsParams): Promise<Job[]> => {
  try {
    const response = await fetch(
      `https://kxiqztfueasspcdjpbfq.supabase.co/rest/v1/jobs?candidate_id=eq.${userId}&order=id.desc`,
      {
        headers: {
           apikey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt4aXF6dGZ1ZWFzc3BjZGpwYmZxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkxODE1OTQsImV4cCI6MjA2NDc1NzU5NH0.zhh9G8FsIUVeMhJMbcrxiE24-wHV6yTstVsCj-wksCQ",
            Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt4aXF6dGZ1ZWFzc3BjZGpwYmZxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0OTE4MTU5NCwiZXhwIjoyMDY0NzU3NTk0fQ.ohJi_t3-4ZYRKfGLJj74H3_efw0zrkpPwJiUIEImnbc",
            "Content-Type": "application/json",
            Prefer: "return=representation",
          },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch jobs for user: ${response.status}, message: ${errorText}`);
    }

    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Error in fetchUserDataAndJobs:", error);
    return [];
  }
};


interface FetchJobDetailsParams {
  jobId: string;
  onSuccess: (jobs: Job[]) => void;
  onError: (message: string) => void;
  onLoadingChange: (loading: boolean) => void;
}

export const fetchJobDetails = async ({
  jobId,
  onSuccess,
  onError,
  onLoadingChange,
}: FetchJobDetailsParams) => {
  onLoadingChange(true); // Indicate loading has started
  try {
    const response = await fetch(
      `https://kxiqztfueasspcdjpbfq.supabase.co/rest/v1/jobs?id=eq.${jobId}`,
      {
        headers: {
          apikey:
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt4aXF6dGZ1ZWFzc3BjZGpwYmZxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkxODE1OTQsImV4cCI6MjA2NDc1NzU5NH0.zhh9G8FsIUVeMhJMbcrxiE24-wHV6yTstVsCj-wksCQ",
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt4aXF6dGZ1ZWFzc3BjZGpwYmZxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0OTE4MTU5NCwiZXhwIjoyMDY0NzU3NTk0fQ.ohJi_t3-4ZYRKfGLJj74H3_efw0zrkpPwJiUIEImnbc",
          "Content-Type": "application/json",
          Prefer: "return=representation",
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }

    const data = await response.json();
 
    // Supabase often returns an array, even if only one item is expected.
    // We'll pass the first item or null if the array is empty.
    onSuccess(data.length > 0 ? data : []);
  } catch (error) {
    console.error("Error fetching job details:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
    onError(errorMessage);
    toast.error(`Failed to fetch job details: ${errorMessage}`, { duration: 3000, position: "top-center" });
  } finally {
    onLoadingChange(false); // Ensure loading is turned off
  }
};