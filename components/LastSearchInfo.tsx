import { useEffect, useState } from "react";
import moment from "moment";

const LastSearchInfo = ({ allJobs }) => {
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
