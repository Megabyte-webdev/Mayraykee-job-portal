import { useEffect, useState } from "react";
import useApplicationManagement from "../../../hooks/useApplicationManagement";
import { resourceUrl } from "../../../services/axios-client";
import { useNavigate } from "react-router-dom";

function ApplicantCard({ data, exclusive=false }) {
  const navigate = useNavigate();
  const { getApplicant } = useApplicationManagement();
  const [applicant, setApplicant] = useState();

 
  const navigateToApplicantDetails = () =>{
    if(exclusive){
      navigate(`/admin-exclusives/applicants/detail/${data.id}`, { state: { data } });
    }else{
      navigate(`/company/applicants/detail/${data.id}`, { state: { data } });
    }
  }
    
  useEffect(() => {
    getApplicant(data?.candidate_id, setApplicant);
  }, []);
  return (
    <div className="w-full h-[120px] border p-2 flex flex-col justify-between items-center">
      <div className="flex w-[80%] gap-[15px] items-center">
        <img
          src={`${resourceUrl}/${applicant?.profile}`}
          className="h-[50px] w-[50px] bg-gray-400 rounded-full"
        />
        <div className="flex flex-col ">
          <h3 className="text-sm font-semibold">{data?.full_name}</h3>
          <button
            onClick={navigateToApplicantDetails}
            className="text-little hover:underline cursor-pointer  text-primaryColor"
          >
            View Profile
          </button>
        </div>
      </div>

      <div className="flex justify-between w-[80%] gap-[20px] items-center">
        <span className="flex flex-col items-center text-gray-400  text-little ">
          Applied on
          <span className="text-gray-700">
            {new Date(data?.created_at).toLocaleDateString()}
          </span>
        </span>

        <span className="flex flex-col items-center text-gray-400  text-little ">
          Gender
          <span className="text-gray-700">{applicant?.gender}</span>
        </span>
      </div>
    </div>
  );
}

export default ApplicantCard;
