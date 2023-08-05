import React, { useEffect, useState } from "react";

const TimeToNow = ({ timestamp }) => {
  const [timeSinceUpload, setTimeSinceUpload] = useState("");

  useEffect(() => {
    // Function to convert Unix timestamp to human-readable time
    const timeSinceUpload = (timestamp) => {
      const currentTime = Math.floor(Date.now() / 1000); // Convert current time to Unix timestamp in seconds
      const secondsElapsed = Math.floor(currentTime - timestamp / 1000); // Convert timestamp to seconds and calculate elapsed time

      const oneWeekInSeconds = 604800;
      const oneYearInSeconds = 31536000;

      if (secondsElapsed < 60) {
        return secondsElapsed + "s ago";
      } else if (secondsElapsed < 3600) {
        return Math.floor(secondsElapsed / 60) + "m ago";
      } else if (secondsElapsed < 86400) {
        return Math.floor(secondsElapsed / 3600) + "h ago";
      } else if (secondsElapsed < oneWeekInSeconds) {
        return Math.floor(secondsElapsed / 86400) + "d ago";
      } else if (secondsElapsed < oneYearInSeconds) {
        const uploadDate = new Date(timestamp);
        const options = { day: "numeric", month: "short" };
        return uploadDate.toLocaleDateString("en-US", options);
      } else {
        const uploadDate = new Date(timestamp);
        const options = { day: "numeric", month: "short", year: "numeric" };
        return uploadDate.toLocaleDateString("en-US", options);
      }
    };

    // Convert the Unix timestamp to human-readable time
    const timeAgo = timeSinceUpload(parseInt(timestamp, 10));
    setTimeSinceUpload(timeAgo);
  }, [timestamp]);

  return <time>{timeSinceUpload}</time>;
};

export default TimeToNow;
