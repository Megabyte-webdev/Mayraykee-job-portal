import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { axiosClient } from "../../../services/axios-client";
import { AuthContext } from "../../../context/AuthContex";
import { FormatError } from "../../../utils/formmaters";
import { onFailure } from "../../../utils/notifications/OnFailure";
import { useLocation, useNavigate } from "react-router-dom";
import { ApplicationContext } from "../../../context/ApplicationContext";

function Shortlist({ data, exclusive, toogleInterview, setEdit }) {
  const { state } = useLocation();
  const { authDetails } = useContext(AuthContext);
  const { setApplication, setInterviewDetails } = useContext(ApplicationContext);
  const client = axiosClient(authDetails?.token);
  const [interview, setInterview] = useState();
  const [error, setError] = useState({
    message: "",
    error: "",
  });
  const [countdown, setCountdown] = useState(null);

  const navigate = useNavigate();

  const handleOnClick = () => {
    const interviewDate = new Date(interview.interview_date);
    const currentDate = new Date();
    setApplication({ ...data });
    navigate("/interview-room", { state: { interview: interview, exclusive: { user: state?.exclusiveData } } });
  };

  useEffect(() => {
    const initInterview = async () => {
      try {
        const response = await client.get(`/interviews/${data?.interview_id}`);
        setInterview(response.data.interview);
      } catch (error) {
        FormatError(error, setError, "Interview Error");
      }
    };

    initInterview();
  }, []);

  useEffect(() => {
    if (error.message && error.error) {
      onFailure(error);
    }
  }, [error.message, error.error]);

  useEffect(() => {
    let countdownInterval;

    if (interview) {
      const { isLive, hasEnded, countdown: countdownValue } = formatDateTime(
        interview?.interview_date,
        interview?.interview_time
      );

      if (!isLive && !hasEnded && countdownValue) {
        countdownInterval = setInterval(() => {
          const { countdown: updatedCountdown } = formatDateTime(
            interview?.interview_date,
            interview?.interview_time
          );
          setCountdown(updatedCountdown);
        }, 1000);
      }

      return () => clearInterval(countdownInterval); // Clear interval on cleanup
    }
  }, [interview]);

  const formatDateTime = (date, time) => {
  const combinedDateTime = new Date(`${date.split(' ')[0]}T${time}`);
  const now = new Date();
  const endTime = new Date(combinedDateTime.getTime() + 60 * 60 * 1000); // Assuming interview lasts 1 hour
  
  const isLive = now >= combinedDateTime && now <= endTime;
  const hasEnded = now > endTime;
  let countdown = null;

  if (!isLive && !hasEnded) {
    const diff = combinedDateTime - now;
    if (diff > 0) {
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);
      countdown = `${days}d ${hours}h ${minutes}m ${seconds}s`;
    }
  }

  const formattedDate = combinedDateTime.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const formattedTime = combinedDateTime.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return {
    isLive,
    hasEnded,
    formattedDate,
    formattedTime,
    countdown,
  };
};

  return (
    interview && (
      <>
        {(() => {
          const { isLive, formattedDate, formattedTime, hasEnded } = formatDateTime(
            interview?.interview_date,
            interview?.interview_time
          );
          
          return (
            <>
              <h3 className="px-2 text-little">An Interview has been Scheduled</h3>
              <div className="grid grid-cols-2 w-full gap-y-2 justify-between items-center px-2">
                <div className="flex flex-col">
                  <span className="text-gray-400 text-sm">Interview Date</span>
                  <span className="text-gray-700 font-semibold text-little">
                    {formattedDate}
                  </span>
                </div>
                <div className="flex flex-col w-[40%]">
                  <span className="text-gray-400 text-sm">Interviewer</span>
                  <span className="text-gray-700 font-semibold text-little">
                    {interview?.interviewer_name}
                  </span>
                </div>

                {interview?.location && (
                  <div className="flex flex-col">
                    <span className="text-gray-400 text-sm">Interview Location</span>
                    <span className="text-gray-700 font-semibold text-little">
                      {interview?.location}
                    </span>
                  </div>
                )}

                <div className="flex flex-col">
                  <span className="text-gray-400 text-sm">Interview Time</span>
                  <span className="text-gray-700 font-semibold text-little">
                    {formattedTime}
                  </span>
                </div>
                {interview?.meeting_id && (
                  <div className="flex flex-col">
                    <span className="text-gray-400 text-sm">Meeting Id</span>
                    <span className="text-gray-700 font-semibold text-little">
                      {interview?.meeting_id}
                    </span>
                  </div>
                )}
                <div className="flex flex-col">
                  <span className="text-gray-400 text-sm">Add Ons</span>
                  <span className="text-gray-700 font-semibold text-little">
                    {interview?.notes}
                  </span>
                </div>
              </div>

              {countdown && (
                <div className="flex px-2 gap-2 items-center">
                  <span className="text-gray-700 font-semibold text-little">
                    Time Remaining: {countdown}
                  </span>
                </div>
              )}

              <div className="flex px-2 gap-2 items-center">
                <button
                  onClick={handleOnClick}
                  disabled={!isLive || hasEnded}
                  className="border w-fit hover:bg-primaryColor hover:text-white py-1 text-little px-2 border-primaryColor cursor-pointer disabled:hover:text-gray-700 disabled:hover:bg-transparent disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  {isLive && "Proceed to Interview"}
                  {hasEnded && "Interview Ended"}
                  {countdown && "Not Live"}
                </button>
                <button
               
                  onClick={() => { setEdit(true); setInterviewDetails(interview); toogleInterview(); }}
                  className="border w-[40%] md:w-[20%] disabled:hover:text-gray-700 disabled:hover:bg-transparent disabled:opacity-30 hover:bg-primaryColor cursor-pointer disabled:cursor-not-allowed hover:text-white p-2 md:py-1 text-little px-2 border-primaryColor"
                >
                  Edit Interview
                </button>
              </div>
            </>
          );
        })()}
      </>
    )
  );
}

export default Shortlist;
