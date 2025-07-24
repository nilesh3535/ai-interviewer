import moment from 'moment';
import React, { useState, useEffect } from 'react';

interface ApplyOption {
  is_direct: boolean;
  publisher: string;
  apply_link: string;
}

interface Job {
  id: number;
  job_id: string;
  job_title: string;
  search_data: string;
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
interface JobListSectionProps {
  jobs: Job[];
}

export default function JobListSection({ jobs }: JobListSectionProps) {
  // Example state (e.g., job list), if needed
  

const jobTypes = ['Full Time', 'Part Time', 'Remote','Contractor', 'Internship'];
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

  const toggleType = (type: string) => {
    setSelectedTypes((prev) =>
      prev.includes(type)
        ? prev.filter((t) => t !== type)
        : [...prev, type]
    );
  };

  const clearAll = () => {
    setSelectedTypes([]);
  };

  const [currentPage, setCurrentPage] = useState(1);
const jobsPerPage = 10; // Change as needed
//main job list filtering logic
const filteredJobs = selectedTypes.length > 0
  ? jobs.filter((job) => {
      // Normalize and split job type string
      const jobTypesArray = job.job_employment_type
        .toLowerCase()
        .replaceAll('–', '')                     // e.g. "full-time" → "fulltime"
        .replaceAll('-', '')                     // e.g. "full-time" → "fulltime"
        .split(/\s+and\s+|\s*,\s*/);            // split on "and" or comma if exists
       console.log("Job Types Array:", jobTypesArray);
      return selectedTypes.some(selected =>
        jobTypesArray.includes(selected.replace(" ","").toLowerCase())
      );
    })
  : jobs;

const indexOfLastJob = currentPage * jobsPerPage;
const indexOfFirstJob = indexOfLastJob - jobsPerPage;
const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);
useEffect(() => {
  window.scrollTo({ top: 500, behavior: "smooth" });
}, [currentPage]);
return (
  <div className="w-full bg-white">
    <div className="container mx-auto py-16 xl:py-20 px-5 md:px-0">
      <div className="grid grid-cols-12 lg:gap-12">
        <aside className="hidden xl:block xl:col-span-3">
          <div className="p-6 bg-accent-content/5 rounded-xl">
            <div className="flex items-center justify-between">
              <h5 className="text-lg font-semibold text-accent-content">Job Type</h5>
              <button
          onClick={clearAll}
          className="text-sm text-accent-content underline hover:text-accent-content/20 cursor-pointer"
        >
          Clear
        </button>
            </div>
            <div className="mt-6 flex flex-col gap-3">
        {jobTypes.map((label) => (
          <label key={label} className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={selectedTypes.includes(label)}
              onChange={() => toggleType(label)}
              className="checkbox checkbox-primary bg-base-100 border border-base-content/20"
            />
            <span className="label-text text-base text-accent-content/60">
              {label}
            </span>
          </label>
        ))}
      </div>
          </div>

        <div className="mt-6">
  <div className="bg-base-300/30 rounded-xl text-center">
  {/* eslint-disable-next-line @next/next/no-img-element */}
    <img
      src="/jobad.png"
      onError={(e) => {
        e.currentTarget.src = "/jobimg.png"; // fallback image
      }}
      alt="Get your dream jobs - powered by WinYourInterview"
      loading="lazy"
      width={300}
      height={360}
      className="p-1 bg-primary rounded-xl"
      decoding="async"
      data-nimg="1"
      style={{ color: "transparent" }}
    />
  </div>
</div>

        </aside>

        <section className="col-span-12 xl:col-span-9" id="find-job">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-semibold text-accent-content">Latest Jobs</h3>
            <p className="text-base text-accent-content/60">
              {filteredJobs.length.toLocaleString()} Results Found
            </p>
          </div>

          <div className="mt-8 flex flex-col gap-6">
            {currentJobs.map((job, idx) => (
              <div
                key={idx}
                className="p-6 bg-white hover:bg-gray-50 hover:duration-500 transition border border-base-100/20 rounded-xl group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                   
                    
                       {/* eslint-disable-next-line @next/next/no-img-element */}
                   <img
                    alt="company logo"
                    loading="lazy"
                    width={48}
                    height={48}
                    className="p-2 bg-accent-content rounded-xl"
                    src={job.employer_logo || "/jobimg.png"}
                    onError={(e) => {
                      e.currentTarget.src = "/jobimg.png"; // fallback image
                    }}
                  />
                   <a
                    className="flex items-center gap-1.5 px-4 py-2.5 text-accent-content/60 bg-accent-content/5 group-hover:bg-accent-content group-hover:text-white rounded-lg transition md:hidden"
                    href={`/jobs/${job.id}details=${job.job_id}&rq=${job.id}&cd=${job.candidate_id}`}
                  >
                    View Job
                    {/* Icon omitted for brevity */}
                  </a>
              
                    <div>
                      <p className="text-sm font-medium text-accent">
                        {job.employer_name}
                      </p>
                      <h6 className="mt-1 text-lg font-semibold text-accent-content group-hover:opacity-100 transition">
                        <a href={`/jobs/${job.id}details=${job.job_id}&rq=${job.id}&cd=${job.candidate_id}`}>{job.job_title}</a>
                      </h6>
                      <div className="mt-3 flex items-center gap-2">
                        <p className="bg-accent-content/5 px-2 py-1 text-xs text-accent-content/60 rounded-md">
                          {job.job_employment_type}
                        </p>
                        <p className="bg-accent-content/5 px-2 py-1 text-xs text-accent-content/60 rounded-md">
                          {job.job_min_salary||""}-{job.job_max_salary||""}
                        </p>
                        <p className="bg-accent-content/5 px-2 py-1 text-xs text-accent-content/60 rounded-md">
                        {job.job_posted_at_datetime_utc? moment(job.job_posted_at_datetime_utc).format('MMM DD, YYYY'):"-" }
                        </p>
                          <p className="bg-accent-content/5 px-2 py-1 text-xs text-accent-content/60 rounded-md">
                         {job.job_posted_at_datetime_utc?moment(job.job_posted_at_datetime_utc).fromNow():"-"}
                        </p>
                        <p className="bg-accent-content/5 px-2 py-1 text-xs text-accent-content/60 rounded-md">
                          {job.job_location}
                        </p>
                         <p className="hidden md:bg-accent-content/5 px-2 py-1 text-xs text-accent-content/60 rounded-md">
                          {job.search_data}
                        </p>
                      </div>
                    </div>
                  </div>
                  <a
                    className="hidden md:flex items-center gap-1.5 px-4 py-2.5 text-accent-content/60 bg-accent-content/5 group-hover:bg-accent-content group-hover:text-white rounded-lg transition"
                    href={`/jobs/${job.id}details=${job.job_id}&rq=${job.id}&cd=${job.candidate_id}`}
                  >
                    View Job
                    {/* Icon omitted for brevity */}
                  </a>
                </div>
                <p className="mt-5 text-base text-accent-content/60 line-clamp-3">{job.job_description}</p>
              </div>
            ))}
          </div>
          {filteredJobs.length ?<div className="mt-8 flex justify-center gap-2">
            <button
              className="btn btn-sm"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Prev
            </button>

           {Array.from({ length: Math.ceil(filteredJobs.length / jobsPerPage) }).map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentPage(idx + 1)}
            className={`btn btn-sm ${currentPage === idx + 1 ? "btn-outline btn-neutral" : "btn-outline"}`}
          >
            {idx + 1}
          </button>
        ))}

            <button
              className="btn btn-sm"
             onClick={() =>
    setCurrentPage((prev) =>
      Math.min(prev + 1, Math.ceil(filteredJobs.length / jobsPerPage))
    )
  }
  disabled={currentPage === Math.ceil(filteredJobs.length / jobsPerPage)}
            >
              Next
            </button>
          </div>
          :
          <div className="mt-8 text-center">
            <p className="text-lg text-accent-content/60">
              No data found for `{selectedTypes.join().replaceAll(","," | ")}`
            </p>
          </div>
}
     {jobs.length==0 &&<div className="mt-8 text-center">
        <p className="text-lg text-accent-content/60">
          You haven&apos;t searched for any jobs yet.
        </p>
         <p className="text-lg text-accent-content/60">
         Click the above &quot;<b>find your dream jobs</b>&quot; button to start searching.
         </p>
      </div>

}

         
        </section>
      </div>
    </div>
    </div>
  );
}
