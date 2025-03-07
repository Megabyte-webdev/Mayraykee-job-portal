import { useLocation, useParams } from "react-router-dom";
import ApplicantHeader from "./ApplicantHeader";
import ApplicantProfileCard from "./ApplicantProfileCard";
import MainContent from "./MainContent";
import { useContext, useEffect, useState } from "react";
import { axiosClient } from "../../services/axios-client";
import { toast } from "react-toastify";
import { AuthContext } from "../../context/AuthContex";
import { PiSpinnerGap } from "react-icons/pi";

const ApplicantDetails = () => {
  const { authDetails } = useContext(AuthContext);
  const client = axiosClient(authDetails.token);
  const { id } = useParams();
  const [staff, setStaff] = useState(null);


  useEffect(() => {
    const initData = async () => {
      try {
        const { data } = await client.get(`/domesticStaff/get-staff/${id}`);
        if (data.data) {
          setStaff(data.data);
        }
      } catch (error) {
        toast.error("Unable to retrieve staff data");
      }
    };

    initData();
  }, []);

  return (
    <div className="p-5 bg-white min-h-screen text-gray-900">
      {staff ? (
        <>
          <ApplicantHeader staff={staff} setStaff={setStaff} />
          <div className="flex gap-4 flex-col lg:flex-row">
            <ApplicantProfileCard userData={staff} />
            <MainContent staff={staff} />
          </div>
        </>
      ) : (
        <div className="h-screen w-full flex text-3xl text-primaryColor  flex-col items-center justify-center gap-3">
          <PiSpinnerGap className="animate-spin" />
          <span className="text-sm">Fetching data....</span>
        </div>
      )}
    </div>
  );
};

export default ApplicantDetails;
