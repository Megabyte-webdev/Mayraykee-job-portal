import { useParams } from "react-router-dom";
import CompaniesProfile from "../../../company-module/pages/company-profile/CompanyProfile";


function ViewProfile() {
  const {id} = useParams()
  return (
    <div className="w-full h-[90%]">
      <CompaniesProfile exclusiveId={id}/>
    </div>
  );
}

export default ViewProfile;
