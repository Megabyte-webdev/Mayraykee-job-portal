import axios from "axios";
import React, { useState, useEffect, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { BASE_URL } from "../../../utils/base";
import { AuthContext } from "../../../context/AuthContex";

const ShortListedDetails = () => {
  const { state } = useLocation();
  const { authDetails } = useContext(AuthContext);
  const [newInterview, setNewInterview] = useState();
  const [timeLeft, setTimeLeft] = useState(null);
  const [statusMessage, setStatusMessage] = useState(""); // Live/Ended status message
  const [isLive, setIsLive] = useState(false); // Determines if the interview is live
  const navigate = useNavigate();

  // Fetch interview details
  const getInterviews = (id, setState) => {
    axios
      .get(`${BASE_URL}/interviews/${id}`, {
        headers: {
          Authorization: `Bearer ${authDetails.token}`,
        },
      })
      .then((response) => {
        console.log("Interview details:", response.data);
        setState(response.data.interview);
      })
      .catch((error) => {
        console.error("Error fetching interview details:", error);
      });
  };

  // Handle navigation to the interview room
  const handleOnClick = () => {
    navigate("/interview-room", { state: { interview: newInterview } });
  };

  useEffect(() => {
    if (state.app?.interview_id) {
      getInterviews(state.app.interview_id, setNewInterview);
    }
  }, [state.app?.interview_id]);

  // Helper function to format the date and time
  const formatDateTime = (date, time) => {
    const combinedDateTime = new Date(`${date.split(" ")[0]}T${time}`);
    const now = new Date();
    const endTime = new Date(combinedDateTime.getTime() + 60 * 60 * 1000);

    const isLive = now >= combinedDateTime && now <= endTime;
    const hasEnded = now > endTime;

    let countdown = null;
    if (!isLive && !hasEnded && now < combinedDateTime) {
      const diff = combinedDateTime - now;
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);
      countdown = `${days}d ${hours}h ${minutes}m ${seconds}s`;
    }

    const formattedDate = combinedDateTime.toLocaleDateString("en-US", {
      month: "short", // Short month name, e.g., "Jan"
      day: "numeric", // Day as a number, e.g., "1"
      year: "numeric", // Full year, e.g., "2025"
    });

    const formattedTime = combinedDateTime.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true, // Ensures AM/PM is included
    });

    return {
      isLive,
      hasEnded,
      formattedDate,
      formattedTime,
      countdown,
    };
  };

  useEffect(() => {
    if (newInterview?.interview_date && newInterview?.interview_time) {
      const { isLive, hasEnded, countdown } = formatDateTime(
        newInterview.interview_date,
        newInterview.interview_time
      );

      console.log("isLive:", isLive, "hasEnded:", hasEnded, "countdown:", countdown);

      setIsLive(isLive);
      setStatusMessage(
        isLive
          ? "The interview is live now."
          : hasEnded
          ? "The interview has ended."
          : "The interview is not live yet."
      );
      setTimeLeft(countdown);

      // Countdown timer
      if (!isLive && !hasEnded && countdown) {
        const interval = setInterval(() => {
          const updatedCountdown = formatDateTime(
            newInterview.interview_date,
            newInterview.interview_time
          ).countdown;
          setTimeLeft(updatedCountdown);
        }, 1000);

        return () => clearInterval(interval);
      }
    }
  }, [newInterview]);

  return (
    <div className="h-full w-full text-s text-primary py-3">
      <h4 className="font-semibold text-lg sm:text-xl md:text-2xl mb-5">
        Your Interview Information
      </h4>

      {/* Countdown Timer */}
      {timeLeft && (
        <div className="bg-blue-50 text-blue-600 p-4 rounded-md mb-4">
          <p className="font-medium">
            Time Left for Interview: <span className="font-bold">{timeLeft}</span>
          </p>
        </div>
      )}

      {/* Live/Ended Status */}
      {statusMessage && (
        <div
          className={`p-4 mb-4 rounded-md ${
            isLive ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
          }`}
        >
          <p className="font-medium">{statusMessage}</p>
        </div>
      )}

      {/* Interview Details */}
      <div className="rounded w-full sm:w-[90%] md:w-[80%] border">
        {[ 
          { label: "Interview Name:", value: newInterview?.interviewer_name },
          {
            label: "Interview Date:",
            value: newInterview
              ? formatDateTime(newInterview.interview_date, newInterview.interview_time)
                  .formattedDate
              : null,
          },
          {
            label: "Interview Time:",
            value: newInterview
              ? formatDateTime(newInterview.interview_date, newInterview.interview_time)
                  .formattedTime
              : null,
          },
          { label: "Location:", value: newInterview?.location },
          { label: "Note:", value: newInterview?.notes },
          { label: "Meeting Id:", value: newInterview?.meeting_id },
        ].map(
          (item, index) =>
            item?.value && (
              <div className="flex flex-col sm:flex-row" key={index}>
                <div className="w-full sm:w-1/3 bg-lightorange p-4">
                  <p className="font-bold">{item.label}</p>
                </div>
                <div className="w-full sm:w-2/3 p-4">
                  <p>{item?.value || "..."}</p>
                </div>
              </div>
            )
        )}
      </div>

      {/* Proceed Button */}
      {isLive && !state.interviewFinshed ? (
        <button
          onClick={handleOnClick}
          className="flex w-full sm:w-auto border mt-5 hover:bg-primaryColor hover:text-white border-primaryColor p-2 text-sm sm:text-little disabled:opacity-50 text-primaryColor"
        >
          Proceed to Interview
        </button>
      ) : (
        <span className="text-sm font-semibold">
          {statusMessage || "Awaiting Candidate Response"}
        </span>
      )}
    </div>
  );
};

export default ShortListedDetails;
