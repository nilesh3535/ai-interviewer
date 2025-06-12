// lib/jobs.action.ts
// This file will contain client-side data fetching logic.
// It needs "use client" if it uses browser-specific APIs directly,
// but for simple fetch, it's often implied by being imported by a "use client" component.
// Adding "use client" here ensures it's treated as client-side code if this file is imported by a server component.
"use client";

import { toast } from "sonner"; // Assuming sonner is a client-side library
import moment from "moment"; // Assuming moment is used for date comparisons
import { getCurrentUser } from "./auth.action";

// Define types used by this function
interface User {
  id: string;
  name: string;
  email: string;
  photoURL?: string;
  emailVerified?: boolean;
  packs?: string;
}
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
  user: User | null;
  role: string;
  city: string;
  level: string;
  allJobs: Job[];
  onSuccess: (jobs: Job[]) => void;
  onError: (error: unknown) => void;
  onStatusChange: (status: boolean) => void;
}

export const fetchAndProcessJobs = async ({
  user,
  role,
  city,
  level,
  allJobs,
  onSuccess,
  onError,
  onStatusChange,
}: GetJobsParams) => {
  if (role.trim() === "") {
    toast.error("Please enter a role!", { duration: 2000, position: "top-center" });
    return;
  }
  if (level === "Select Experience Level") {
    toast.error("Please select an experience level!", { duration: 2000, position: "top-center" });
    return;
  }
  if (city.trim() === "") {
    toast.error("Please enter a city/preferred location!", { duration: 2000, position: "top-center" });
    return;
  }

  // Logic for checking if already searched today (client-side specific)
  if (allJobs.length > 0) {
    const jobDate = moment(allJobs[0].created_date).startOf("day");
    const today = moment().startOf("day");
    const isSameDay = jobDate.isSame(today, "day");
    if (isSameDay) {
      toast.error("You have already searched for jobs today!", { duration: 2000, position: "top-center" });
      return; // Stop the function here
    }
  }

  console.log("Searching... Please wait");
  onStatusChange(true); // Set loading status in the component
  const loadingToastId = toast.loading("Searching jobs for you... Please wait while it loads. Do not close this window.", {
    duration: 5000,
    id: "loading-toast",
  });

  try {
    const response = await fetch("http://67.217.62.107/webhook/cbae3c40-0050-4cda-ae1a-301a758ffb02", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userid: user?.id, position: role, location: city, experience: level }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }

    const data = await response.text();
    console.log("API Response:", data);

    toast.dismiss(loadingToastId);
    toast.success("Jobs fetched successfully!", {
      duration: 2000,
      position: "top-center",
    });

    onSuccess(JSON.parse(data)); // Update jobs in the component
    // Consider if window.location.reload() is truly necessary here.
    // If onSuccess updates the state correctly, the UI should re-render without a full page reload.
    // If you need a full refresh, keep it, but it's generally avoided for SPA-like behavior.
    // window.location.reload();

  } catch (error) {
    console.error("Error fetching jobs:", error);
    toast.dismiss(loadingToastId);
    toast.error("Failed to fetch jobs.", { duration: 3000, position: "top-center" });
    onError(error); // Pass error back to component if needed
  } finally {
    onStatusChange(false); // Ensure status is reset
  }
};

interface FetchUserDataAndJobsParams {
  onUserFetched: (user: User | null) => void;
  onJobsFetched: (jobs: Job[]) => void;
  onLoadingChange: (loading: boolean) => void;
  onError: (error: unknown) => void;
}

export const fetchUserDataAndJobs = async ({
  onUserFetched,
  onJobsFetched,
  onLoadingChange,
  onError,
}: FetchUserDataAndJobsParams) => {
  onLoadingChange(true);
  try {
    const currentUser = await getCurrentUser();
    onUserFetched(currentUser); // Update user state in the component

    if (currentUser) {
      const response = await fetch(
        `https://kxiqztfueasspcdjpbfq.supabase.co/rest/v1/jobs?candidate_id=eq.${currentUser.id}&order=id.desc`,
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

      const data = await response.json(); // Use .json() directly as you're expecting JSON
      onJobsFetched(data); // Update allJobs state in the component
    }
  } catch (error) {
    console.error("Error in fetchUserDataAndJobs:", error);
    toast.error("Failed to load user data or previous job searches.", { duration: 3000, position: "top-center" });
    onError(error);
  } finally {
    onLoadingChange(false);
  }
};