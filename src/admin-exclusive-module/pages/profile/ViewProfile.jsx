import CompaniesProfile from "../../../company-module/pages/company-profile/CompanyProfile";
import PopUpBox from "../../../components/PopUpBox";

function ViewProfile() {
  return (
    <div className="w-full h-[90%]">
      <CompaniesProfile test={true}/>
    </div>
  );
}

export default ViewProfile;
