import { Helmet } from "react-helmet";
import ProfileHeader from "../../components/company-profile/ProfileHeade";
import { company_profile_attributes } from "../../../utils/constants";
import HeaderAttribute from "../../components/company-profile/HeaderAttribute";
import DetailsLeft from "../../components/company-profile/DetailsLeft";
import DetailsRight from "../../components/company-profile/DetailsRight";
import { useState } from "react";
import UpdateCompanyProfileModal from "../../components/company-profile/UpdateCompanyProfileModal";
import useCompanyProfile from "../../../hooks/useCompanyProfile";
import {
  FaRegEdit,
  FaFacebook,
  FaLinkedin,
  FaTwitter,
  FaInstagram,
} from "react-icons/fa";
import { dummy_user } from "../../../utils/dummies";

function CompaniesProfile({ test = false }) {
  const [displayPic, setDisplayPic] = useState("");
  const companyHookProps = useCompanyProfile();
  const { details, retrievalState } = companyHookProps;

  const exclusiveDetail = {...dummy_user.details};

  const [isOpen, setIsOpen] = useState(false);

  const company_profile_attributes = [
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
  const ex_company_profile_attributes = [
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

  return test ? (
    <>
      <Helmet>
        <title> Company Dashboard | Companies Profile </title>
      </Helmet>
      <UpdateCompanyProfileModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        onInit={details.company_name ? false : true}
        companyHookProps={companyHookProps}
      />
      {details.company_name &&
      details.beenRetreived === retrievalState.retrieved ? (
        <div className="h-full w-full flex flex-col px-2 md:px-12 py-2 justify-between">
          <ProfileHeader
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            displayPic={displayPic}
            details={details}
            setDisplayPic={setDisplayPic}
          >
            {company_profile_attributes.map((current) => (
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
    </>
  ) : (
    <>
      <Helmet>
        <title> Company Dashboard | Companies Profile </title>
      </Helmet>
      {/* <UpdateCompanyProfileModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        onInit={details.company_name ? false : true}
        companyHookProps={companyHookProps}
      /> */}
      {exclusiveDetail.company_name && true ? (
        <div className="h-full w-full flex flex-col px-2 md:px-12 py-2 justify-between">
          <ProfileHeader
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            displayPic={displayPic}
            details={exclusiveDetail}
            setDisplayPic={setDisplayPic}
          >
            {ex_company_profile_attributes.map((current) => (
              <HeaderAttribute key={current.id} data={current} />
            ))}
          </ProfileHeader>

          <div className="flex flex-col mt-8 md:mt-0 md:flex-row w-full justify-between overscroll-y-auto h-[73%]">
            <DetailsLeft data={exclusiveDetail} />
            <DetailsRight data={exclusiveDetail} />
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
    </>
  );
}

export default CompaniesProfile;
