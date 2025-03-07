import { useLocation } from "react-router-dom";
import PrimaryDetail from "../../components/applicants/PrimaryDetail";
import SecondaryDetail from "../../components/applicants/SecondaryDetail";
import { useContext, useEffect, useState } from "react";
import ScheduleInterviewModal from "../../components/applicants/ScheduleInteviewModal";
import { ApplicationContext } from "../../../context/ApplicationContext";

function SingleApplicant() {
  const location = useLocation();

  const [isOpen, setIsOpen] = useState(false);
  const [edit, setEdit] = useState(false);
  const { application, 
    setApplication, 
    getApplicant,
    interviewDetails,
    onTextChange,
    loading,
    scheduleInterview, } = useContext(ApplicationContext);
  const [applicationData, setApplicantData] = useState(location?.state?.data);

  const [applicant, setApplicant] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const toogleInterview = () => setIsOpen(!isOpen);
const exclusiveData=location?.state?.exclusiveData || null;
  const handleOnSubmit = (e, selectedOption, meetingId) => {
    e.preventDefault();
    scheduleInterview(
      applicant,
      applicationData,
      setApplicantData,
      () => {
        toogleInterview();
      },
      selectedOption,
      meetingId,
      exclusiveData,
      edit
    );
  };

  useEffect(() => {
    if (application) {
      setApplicantData(application);
    }
    return setApplication(null);
  }, [application]);
  console.log(location?.state?.exclusiveData, application)

  useEffect(() => {
    const initApplicant = async () => {
      setIsLoading(true); // Start the loader
      try {
        const result = await getApplicant(
          applicationData?.candidate_id,
          setApplicant
        );
        if (result) {
          setApplicant(result);
        }
      } catch (error) {
        console.error("Error fetching applicant:", error);
      } finally {
        setIsLoading(false); // Stop the loader
      }
    };

    if (applicationData) {
      initApplicant();
    }
  }, [applicationData]);

  return (
    <>
      <ScheduleInterviewModal
        handleOnSubmit={handleOnSubmit}
        loading={loading}
        isOpen={isOpen}
        details={interviewDetails}
        onTextChange={onTextChange}
        setIsOpen={setIsOpen}
        edit={edit}
      />
      {isLoading ? (
        <div className="w-full flex items-center justify-center h-screen">
          <div className="animate-spin border-4 border-gray-200 border-t-primaryColor rounded-full w-8 h-8"></div>
          <span className="ml-3 text-primaryColor font-semibold">
            Loading...
          </span>
        </div>
      ) : (
        applicant && (
          <div className="w-full flex flex-col h-full gap-[5px]">
            <div className="w-full flex justify-between ">
              <h2 className="font-semibold text-md">Applicant's Details</h2>
              {/* 
              <button className="text-little py-1 px-2 bg-white border text-primaryColor border-primaryColor ">
                More Action
              </button> */}
            </div>

            <div className="flex flex-col md:flex-row justify-between h-full">
              <PrimaryDetail
                data={applicationData}
                applicant={applicant}
                toogleInterview={toogleInterview}
              />
              <SecondaryDetail
                data={applicationData}
                applicant={applicant}
                toogleInterview={toogleInterview}
                exclusive={exclusiveData}
                setEdit={setEdit}
              />
            </div>
          </div>
        )
      )}
    </>
  );
}

export default SingleApplicant;
