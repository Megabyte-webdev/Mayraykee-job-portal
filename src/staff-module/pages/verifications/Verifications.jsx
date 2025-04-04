import { useState, useEffect, useContext } from "react";
import ViewVerifications from "../../components/verifications/ViewVerifications";
import GuarantorForm from "../../components/verifications/GuarantorForm";
import ResidenceForm from "../../components/verifications/ResidenceForm";
import MedicalForm from "../../components/verifications/MedicalForm";
import PoliceReport from "../../components/verifications/PoliceReport";
import WorkExperience from "../../components/verifications/WorkExperience";
import { StaffManagementContext } from "../../../context/StaffManagementModule";

const options = [
  "Verification Status",
  "Guarantor",
  "Residence",
  "Medical History",
  "Police Report",
  "Work Experience"
];

function Verifications() {
  const [option, setOption] = useState(options[0]);
  const { getStaffProfile } = useContext(
    StaffManagementContext
  );
  const renderComponent = () => {
    switch (option) {
      case options[0]:
        return <ViewVerifications />;
      case options[1]:
        return <GuarantorForm />;
      case options[2]:
        return <ResidenceForm />;
      case options[3]:
        return <MedicalForm />;
      case options[4]:
        return <PoliceReport />;
      case options[5]:
        return <WorkExperience />;
    }
  };
  useEffect(()=>{
      getStaffProfile()
    },[])

  return (
    <div className="h-fit w-full py-5 px-2 md:px-12 gap-[15px] flex flex-col">
      <div className="w-full min-h-[45px] border-b grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 ">
        {options.map((current) => (
          <button
            className={`h-full p-2 ${
              option == current
                ? "border-b bg-primaryColor font-semibold text-white text-bold"
                : "border-0 text-gray-400"
            }`}
            onClick={() => setOption(current)}
          >
            {current}
          </button>
        ))}
      </div>
      {renderComponent()}
    </div>
  );
}

export default Verifications;
