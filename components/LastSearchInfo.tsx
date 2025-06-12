import { useEffect, useState } from "react";
import moment from "moment";
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
  apply_options: ApplyOption[];
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
interface LastSearchInfoProps {
  allJobs: Job[];
}

const LastSearchInfo = ({ allJobs }: LastSearchInfoProps) => {
  const [countdown, setCountdown] = useState("");

  useEffect(() => {
    if (allJobs.length === 0) return;

    const lastSearched = moment(allJobs[0].created_date);
    const nextAllowedSearch = lastSearched.clone().add(1, 'day').startOf('day');

    const updateCountdown = () => {
      const now = moment();
      const duration = moment.duration(nextAllowedSearch.diff(now));
      if (duration.asSeconds() <= 0) {
        setCountdown("00:00:00");
        return;
      }
      const hours = String(Math.floor(duration.asHours())).padStart(2, '0');
      const minutes = String(duration.minutes()).padStart(2, '0');
      const seconds = String(duration.seconds()).padStart(2, '0');

      setCountdown(`${hours}:${minutes}:${seconds}`);
    };

    updateCountdown(); // run initially
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval); // cleanup
  }, [allJobs]);

  if (allJobs.length === 0) return null;

  const lastSearched = moment(allJobs[0].created_date);
  const nextAllowedSearch = lastSearched.clone().add(1, 'day').startOf('day');

  return (
    <p className="text-center italic mt-2">
      Last searched on: {lastSearched.format('MMM DD, YYYY hh:mm A')}.<br />
      You can search again in <span className="font-semibold">{countdown}</span> (hh:mm:ss) on {nextAllowedSearch.format('MMM DD, YYYY')}.
    </p>
  );
};

export default LastSearchInfo;
