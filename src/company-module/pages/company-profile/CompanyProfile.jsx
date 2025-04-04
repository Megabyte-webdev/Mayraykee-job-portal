import { Helmet } from "react-helmet";
import ProfileHeader from "../../components/company-profile/ProfileHeade";
import { company_profile_attributes } from "../../../utils/constants";
import HeaderAttribute from "../../components/company-profile/HeaderAttribute";
import DetailsLeft from "../../components/company-profile/DetailsLeft";
import DetailsRight from "../../components/company-profile/DetailsRight";
import { useEffect, useState } from "react";
import UpdateCompanyProfileModal from "../../components/company-profile/UpdateCompanyProfileModal";
import useCompanyProfile from "../../../hooks/useCompanyProfile";
import {
  FaRegEdit,
  FaFacebook,
  FaLinkedin,
  FaTwitter,
  FaInstagram,
  FaSpinner,
} from "react-icons/fa";
import useExclusiveProfile from "../../../hooks/useExclusiveProfile";

function CompaniesProfile({ exclusiveId = null }) {
  const [displayPic, setDisplayPic] = useState("");
  const companyHookProps = exclusiveId
    ? useExclusiveProfile(exclusiveId)
    : useCompanyProfile();
  const { details, retrievalState, getProfile, loading } = companyHookProps;

  const [isOpen, setIsOpen] = useState(false);

  const company_profile_attributes = details?.social_media && [
    {
      id: 1,
      icon: FaFacebook,
      title: "Facebook",
      content: details?.social_media[0],
    },
    {
      id: 2,
      icon: FaTwitter,
      title: "Twitter",
      content: details?.social_media[1],
    },
    {
      id: 3,
      icon: FaInstagram,
      title: "Instagram",
      content: details?.social_media[3],
    },
    {
      id: 4,
      icon: FaLinkedin,
      title: "Linkedin",
      content: details.social_media[2],
    },
  ];

  useEffect(() => {
    if (exclusiveId) {
      getProfile();
    }
  }, []);

  return (
    <>
      <Helmet>
        <title> Company Dashboard | Companies Profile </title>
      </Helmet>
      <div>
      <UpdateCompanyProfileModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        onInit={details?.company_name ? false : true}
        companyHookProps={companyHookProps}
      />
      {loading ? ( // Display FaSpinner as loader during data fetching
        <div className="flex h-full items-center justify-center">
          <FaSpinner className="text-4xl text-green-600 animate-spin" />
        </div>
      ) : details.company_name &&
        details.beenRetreived === retrievalState.retrieved ? (
        <div className="h-full w-full flex flex-col py-2 justify-between">
          <ProfileHeader
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            displayPic={displayPic}
            details={details}
            setDisplayPic={setDisplayPic}
          > 
            {company_profile_attributes?.map((current) => (
              <HeaderAttribute key={current.id} data={current} />
            ))}
          </ProfileHeader>

          <div className="flex flex-col mt-8 md:mt-0 md:flex-row w-full justify-between overscroll-y-auto h-[73%]">
            <DetailsLeft data={details} />
            <DetailsRight data={details} />
          </div>
        </div>
      ) : (
        <div className="flex h-full items-center justify-center w-full flex-col gap-[5px]">
          <h3 className="flex  text-3xl font-bold">Nothing to show</h3>
          <button
            onClick={() => setIsOpen(true)}
            className="text-little font-normal hover:underline text-gray-400"
          >
            Click to start
          </button>
        </div>
      )}
      </div>
    </>
  );
}

export default CompaniesProfile;
