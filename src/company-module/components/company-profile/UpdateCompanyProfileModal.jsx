import { IoMdCloseCircle } from "react-icons/io";
import { getImageURL } from "../../../utils/formmaters";
//import wheelIcon from "../../../assets/pngs/wheel-icon-black.png";
import {
  FaRegEdit,
  FaFacebook,
  FaLinkedin,
  FaTwitter,
  FaInstagram,
} from "react-icons/fa";
import { useEffect, useState } from "react";
import BasicInput from "./BasicInput";
import SocialMediaInput from "./SocialMediaInput";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
//import useCompanyProfile from "../../../hooks/useCompanyProfile";
import FormButton from "../../../components/FormButton";
import { resourceUrl } from "../../../services/axios-client";

export const basic_inputs = [
  {
    id: 1,
    name: "company_name",
    label: "Company Name",
    required: true,
    type: "text",
    placeholder: "Enter Company name",
  },
  {
    id: 2,
    name: "email",
    label: "Company Email",
    required: true,
    type: "email",
    placeholder: "Enter Company Email",
  },
  {
    id: 3,
    name: "phone_number",
    label: "Company Phone",
    required: true,
    type: "tel",
    placeholder: "Enter Company Phone",
  },
  {
    id: 4,
    name: "Company Website",
    label: "Company Website",
    type: "text",
    placeholder: "https://www.example.com",
  },
  {
    id: 5,
    name: "year_of_incorporation",
    label: "Year of Incorporation",
    type: "number",
    placeholder: "2000",
  },
  {
    id: 6,
    name: "rc_number",
    label: "RC Number",
    type: "text",
    placeholder: "RC123456",
  },
  {
    id: 7,
    name: "company_size",
    label: "Company Size",
    type: "number",
    placeholder: "7",
  },
  {
    id: 8,
    name: "sector",
    label: "Sector",
    type: "text",
    placeholder: "technology",
  },
  {
    id: 9,
    name: "introductory_video_url",
    label: "Intorduction video url",
    type: "text",
    placeholder: "https://www.example.com/video.mp4",
  },
  {
    id: 10,
    name: "network",
    label: "Network",
    type: "text",
    placeholder: "Local Network",
  },
  {
    id: 11,
    name: "location",
    label: "Location",
    type: "text",
    placeholder: "123 Example Street, City, Country",
  },
  {
    id: 12,
    name: "address",
    label: "Address",
    type: "text",
    placeholder: "123 Example Street",
  },
  {
    id: 13,
    name: "profile_url",
    label: "Profile Url",
    type: "text",
    placeholder: "https://www.example.com/profile",
  },
];

export const social_media_inputs = [
  {
    id: 1,
    icon: <FaFacebook className="text-lg" />,
    placeholder: "https://www.facebook.com/example",
  },
  {
    id: 2,
    icon: <FaTwitter className="text-lg" />,
    placeholder: "https://www.twitter.com/example",
  },
  {
    id: 3,
    icon: <FaLinkedin className="text-lg" />,
    placeholder: "https://www.linkedin.com/example",
  },
  {
    id: 4,
    icon: <FaInstagram className="text-lg" />,
    placeholder: "https://www.instagram.com/example",
  },
];

function UpdateCompanyProfileModal({
  isOpen,
  setIsOpen,
  onInit = false,
  companyHookProps,
}) {
  const [displayPic, setDisplayPic] = useState("");
  const [socials, setSocials] = useState(["", "", "", ""]);
  const [companyProfile, setCompanyProfile] = useState();
  const {
    details,
    setDetails,
    loading,
    onTextChange,
    updateCompanyProfile,
    retrievalState,
  } = companyHookProps;
  const [campaignPhotos, setCampaignPhotos] = useState([...details?.company_campaign_photos || []]);

  const getCampaingPhotoURL = (e) => {
    const { name } = e.target;
    const file = e.target.files[0]; //filelist is an object carrying all details of file, .files[0] collects the value from key 0 (not array), and stores it in file

    if (file && (file.type === "image/jpeg" || file.type === "image/png")) {
      // You can also perform additional actions with the valid file
      const generatedUrl = URL.createObjectURL(file);
      if (campaignPhotos.length <= 0) return
      const list = [...campaignPhotos, { url: generatedUrl, file: file }];
      const files = list?.map((current) => current.file);
      if (list.length > 0) {
        setDetails({ ...details, [name]: files });
        setCampaignPhotos(list);
      }
    } else {
      // Handle invalid file type
      alert("Please select a valid JPEG or PNG file.");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    updateCompanyProfile(() => {
      setIsOpen(false);
    });
  };

  useEffect(() => {
    setTimeout(() => {
      if (
        details?.beenRetreived === retrievalState?.notRetrieved &&
        onInit
      ) {
     
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }
    }, 1000);
  }, [details?.beenRetreived]);

  return (
    isOpen && (
      <div className="h-full z-10 w-full text-gray-600 text-little flex justify-center items-center bg-gray-600/70 fixed top-0 left-0">
        <div className="w-[90%] sm:max-w-[600px] h-[90%] p-2 flex flex-col  rounded-[10px]  bg-white border">
          <IoMdCloseCircle
            onClick={() => setIsOpen(false)}
            className="text-lg place-self-end  cursor-pointer"
          />
          <div className="w-full px-2 flex gap-[10px] flex-col h-[90%] ">
            <h3 className="font-semibold text-lg border-b pb-2 text-gray-600">{`Update Company Profile`}</h3>

            <form
              onSubmit={handleSubmit}
              className="flex flex-col w-full gap-[10px] h-[95%] overflow-x-auto"
            >
              {/* Logo Input */}
              <div className="flex flex-col">
                <span className="text-sm font-semibold">Company Icon</span>
                <div className="w-[20%] mt-[5px] flex items-start justify-start relative">
                  <img
                    className="h-[50px] w-[50px] rounded-full"
                    src={
                      displayPic
                        ? displayPic
                        : `${resourceUrl}/${details?.logo_image}`
                    }
                  />
                  <input
                    id="displayPic"
                    name="logo_image"
                    type="file"
                    onChange={(e) => {
                      getImageURL(e, setDisplayPic, setDetails);
                    }}
                    className="hidden"
                  />
                  <label
                    htmlFor="displayPic"
                    className="absolute right-12  top-0 cursor-pointer text-primaryColor text-lg"
                  >
                    <FaRegEdit />
                  </label>
                </div>
              </div>

              {/* Basic Form inputs */}
              {basic_inputs?.map((current) => (
                <BasicInput
                  data={current}
                  details={details}
                  onTextChange={onTextChange}
                  key={current.id}
                />
              ))}

              {/* Company Profile Text Editor */}
              <div className="flex flex-col gap-[5px]">
                <span className="text-sm font-semibold">Company Profile</span>

                <div className="flex flex-col gap-[3px] mb-[35px] w-full text-gray-400 justify-between ">
                  <ReactQuill
                    placeholder="Enter company details...."
                    value={details?.company_profile}
                    onChange={(text) =>
                      setDetails({ ...details, company_profile: text })
                    }
                  />
                </div>
              </div>

              {/* Campaign Photos */}
              <div className="w-full flex flex-col gap-[3px]">
                <label
                  htmlFor="currentCampaignPhoto"
                  className="text-sm font-semibold flex w-full justify-between items-center"
                >
                  Capaign Photos <FaRegEdit className="cursor-pointer" />
                </label>
                <input
                  name="company_campaign_photos"
                  onChange={getCampaingPhotoURL}
                  id="currentCampaignPhoto"
                  className="hidden"
                  type="file"
                />
                <div className="w-full min-h-[100px] flex gap-[3px] items-start border-dashed p-2 border overscroll-x-auto">
                  {campaignPhotos?.map((current, idx) => (
                    <img key={idx}
                      className="h-[80px] w-[80px] border"
                      src={current.url}
                    />
                  ))}
                </div>
              </div>

              {/* Social Media Inputs */}
              <div className="w-full flex flex-col gap-[3px]">
                <label
                  htmlFor="currentCampaignPhoto"
                  className="text-sm font-semibold flex w-full justify-between items-center"
                >
                  Social Media Links
                </label>
                <div className="w-full border border-dashed p-2 grid grid-cols-3 gap-[3px]">
                  {social_media_inputs?.map((current) => (
                    <SocialMediaInput
                    key={current?.id}
                      id={current?.id}
                      data={current}
                      socials={details?.social_media}
                      setSocials={setDetails}
                    />
                  ))}
                </div>
              </div>

              <FormButton
                width="w-[50%] bg-primaryColor"
                height="min-h-[30px] mb-[10px]"
                loading={loading}
              >
                Update
              </FormButton>
            </form>
          </div>
        </div>
      </div>
    )
  )
}

export default UpdateCompanyProfileModal;
