import React, { useState, useEffect, useContext } from 'react';
import { FaSpinner } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import useInterviewManagement from '../../hooks/useInterviewManagement';
import { resourceUrl } from "../../services/axios-client";
import { ApplicationContext } from '../../context/ApplicationContext';
import ScheduleInterviewModal from '../../company-module/components/applicants/ScheduleInteviewModal';
import { onFailure } from '../../utils/notifications/OnFailure';
import { onPrompt } from '../../utils/notifications/onPrompt';

const Interviews = () => {
  const [isLoading, setIsLoading] = useState(false); // For fetching interviews
  const [proceedLoading, setProceedLoading] = useState(null); // For "Proceed to Interview"
  const [editLoading, setEditLoading] = useState(null); // For "Proceed to Interview"
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [details, setDetails] = useState({});
  const [interview, setInterview] = useState({});
  const [countdownTrigger, setCountdownTrigger] = useState(0);
  const navigate = useNavigate();
  const {
    setApplication,
    interviewDetails,
    setInterviewDetails,
    onTextChange,
    loading,
    scheduleInterview,
    application } = useContext(ApplicationContext);
  const [isOpen, setIsOpen] = useState(false);
  const { getAllExclusiveInterviews, getEmployerById, getCandidateById, getApplicantByExclusive } = useInterviewManagement();
  const toogleInterview = () => setIsOpen(!isOpen);


  const handleOnSubmit = (e, selectedOption, meetingId) => {
    e.preventDefault();
    scheduleInterview(
      interview,
      application,
      setApplication,
      () => {
        toogleInterview();
        fetchInterviews();
      },
      selectedOption,
      meetingId,
      { id: interview.employer_id },
      true
    );
  };

  const fetchInterviews = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getAllExclusiveInterviews();
      if (response) {
        setData(response);
      } else {
        setError('Failed to load interviews');
      }
    } catch (err) {
      setError('Failed to load interviews');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDetails = async () => {
    try {
      const uniqueIds = new Set();
      data?.forEach((row) => {
        if (!details[`candidate-${row.candidate_id}`]) uniqueIds.add(`candidate-${row.candidate_id}`);
        if (!details[`employer-${row.employer_id}`]) uniqueIds.add(`employer-${row.employer_id}`);
      });

      const promises = Array.from(uniqueIds).map((id) => {
        if (id.startsWith('candidate')) {
          return getCandidateById(id.split("-")[1]);
        } else if (id.startsWith('employer')) {
          return getEmployerById(id.split("-")[1]);
        }
        return null;
      }).filter((promise) => promise !== null);

      const results = await Promise.all(promises);
      const newDetails = results.reduce((acc, result, index) => {
        const id = Array.from(uniqueIds)[index];
        acc[id] = result;
        return acc;
      }, {});

      setDetails((prevDetails) => ({ ...prevDetails, ...newDetails }));
    } catch (err) {
      console.error('Failed to fetch details:', err);
    }
  };

  useEffect(() => {
    fetchInterviews();
  }, []);

  useEffect(() => {
    if (data?.length > 0) fetchDetails();
  }, [data]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdownTrigger((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatDateTime = (date, time) => {
    const combinedDateTime = new Date(`${date.split(' ')[0]}T${time}`);
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

  const handleEditInterview = async (interview) => {
    setEditLoading(interview.id);
    try {
      const applicantData = await getApplicantByExclusive(interview.employer_id);
      const matchedApplication = applicantData?.find(
        (one) => Number(one.id) === Number(interview?.job_application_id)
      );
      if (matchedApplication) {
        setApplication(matchedApplication);
        setInterviewDetails(interview);
        setIsOpen(true);
      } else {
        console.error("Failed to retrieve interview applicant data");
      }
    } catch (error) {
      console.error("Error proceeding to interview:", error);
    } finally {
      setEditLoading(null); // Reset loading
    }
  };

  const handleProceedToInterview = async (interview, auth) => {
    setProceedLoading(interview.id); // Set loading for this specific interview
    try {
      const applicantData = await getApplicantByExclusive(interview.employer_id);
      const matchedApplication = applicantData?.find(
        (one) => Number(one.id) === Number(interview?.job_application_id)
      );
      if (matchedApplication) {
        if(matchedApplication.status==="shortlist"){
        setApplication(matchedApplication);
        console.log(matchedApplication)
        navigate("/interview-room", { state: { interview: interview, exclusive: auth } });
        }else{
          onPrompt("Interview already ended")
          return;
        }
      } else {
        console.error("Failed to retrieve interview applicant data");
      }
    } catch (error) {
      console.error("Error proceeding to interview:", error);
    } finally {
      setProceedLoading(null); // Reset loading
    }
  };

  return (
    <>
      <ScheduleInterviewModal
        handleOnSubmit={handleOnSubmit}
        loading={loading}
        isOpen={isOpen}
        details={interviewDetails}
        onTextChange={onTextChange}
        setIsOpen={setIsOpen}
        edit={true}
      />
      <div className="p-8 min-h-max bg-gray-200/60 flex flex-col gap-y-2">

        <p className="sticky top-18 bg-transparent ml-auto my-2 flex items-center gap-2 text-md font-bold">
          View Interviews
        </p>

        {isLoading ? (
          <div className="w-full h-full flex items-center justify-center">
            <FaSpinner size="24" className="animate-spin text-2xl" />
          </div>
        ) : error ? (
          <div className="text-xl font-semibold text-red-500 text-center">{error}</div>
        ) : data && data.length === 0 ? (
          <div className="text-xl font-semibold">No Interviews</div>
        ) : (
          <div className="w-full grid grid-cols-responsive gap-4 pt-5 gap-y-6 justify-center">
            {data?.map((row) => {
              const { isLive, formattedDate, formattedTime, countdown, hasEnded } = formatDateTime(
                row?.interview_date,
                row?.interview_time
              );

              return (
                <div
                  key={row?.id}
                  className="min-h-[300px] bg-white shadow-lg rounded-lg p-6 flex flex-col items-center"
                >
                  <img
                    className="w-full h-40"
                    src={`${resourceUrl}${details[`employer-${row.employer_id}`]?.details?.logo_image}` || "https://via.placeholder.com/800x400"}
                    alt="Employer Logo"
                  />
                  <h3 className="text-lg font-bold mt-auto text-green-800">{row?.interviewer_name}</h3>
                  <p className="text-sm text-gray-600 my-2 font-medium">{formattedDate} at {formattedTime}</p>
                  {isLive ? (
                    <p className="mt-1 text-green-600 font-semibold">Status: Live</p>
                  ) : hasEnded ? (
                    <p className="mt-1 text-gray-500 font-semibold">Status: Ended</p>
                  ) : (
                    <p className="mt-1 text-red-700 font-semibold animate-pulse">Starts In: {countdown}</p>
                  )}
                  <div className="my-4 text-sm">
                    <p><strong>Candidate:</strong> {details[`candidate-${row.candidate_id}`]?.full_name || '...'}</p>
                    <p><strong>Company:</strong> {details[`employer-${row.employer_id}`]?.details?.company_name || '...'}</p>
                  </div>
                  {details[`employer-${row.employer_id}`]?.candidateAuth &&
                    <div className="flex gap-2 mt-4 w-full">
                    {(!row?.meeting_id && row.location) ? (
                      <>

                        <button
                          className={`flex-1 flex gap-1 px-3 py-2 rounded-lg text-white ${isLive ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-400 cursor-not-allowed'} flex items-center justify-center`}
                          disabled={!isLive || proceedLoading === row.id}
                        >
                          {proceedLoading === row.id && <FaSpinner size="24" className="animate-spin" />}
                          Physical Interview
                        </button>
                        <button
                          className={`flex-1 flex gap-1 items-center justify-center px-3 py-2 rounded-lg text-white ${(!isLive && !hasEnded) ? "bg-green-500 hover:bg-green-600" : "bg-gray-400 cursor-not-allowed"}`}
                          disabled={isLive || hasEnded || editLoading === row.id}
                          onClick={() => { setInterview(row); handleEditInterview(row) }}
                        >
                          {editLoading === row.id && <FaSpinner size="24" className="animate-spin" />}
                          Edit Interview
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          className={`flex-1 flex items-center justify-center px-2 py-1 rounded-lg text-white ${isLive ? "bg-green-500 hover:bg-green-600" : "bg-gray-400 cursor-not-allowed"}`}
                          disabled={!isLive || proceedLoading === row.id}
                          onClick={() => handleProceedToInterview(row, { user: details[`employer-${row.employer_id}`]?.candidateAuth })}
                        >
                          {proceedLoading === row.id && <FaSpinner size="24" className="animate-spin mr-2" />}
                          Proceed to Interview
                        </button>
                        <button
                          className={`flex-1 flex gap-1 items-center justify-center px-2 py-1 rounded-lg text-white ${(!isLive && !hasEnded) ? "bg-green-500 hover:bg-green-600" : "bg-gray-400 cursor-not-allowed"}`}
                          disabled={isLive || hasEnded || editLoading === row.id}
                          onClick={() => { setInterview(row); handleEditInterview(row) }}
                        >
                          {editLoading === row.id && <FaSpinner size="24" className="animate-spin" />}
                          Edit Interview
                        </button>
                      </>
                    )}
                  </div>}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
};

export default Interviews;
