import { IoMdCloseCircle } from "react-icons/io";
import { getImageURL } from "../../../utils/formmaters";
//import wheelIcon from "../../../assets/pngs/wheel-icon-black.png";
import {
  FaRegEdit,
  FaFacebook,
  FaLinkedin,
  FaTwitter,
  FaInstagram,
  FaTimes,
} from "react-icons/fa";
import { useEffect, useState, useContext } from "react";
import BasicInput from "./BasicInput";
import SocialMediaInput from "./SocialMediaInput";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
//import useCompanyProfile from "../../../hooks/useCompanyProfile";
import FormButton from "../../../components/FormButton";
import { resourceUrl } from "../../../services/axios-client";
import Selector from "../../../components/Selector";
import { JobContext } from "../../../context/JobContext";
import { onFailure } from "../../../utils/notifications/OnFailure";
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
    label: "Company Phone No",
    required: true,
    type: "tel",
    placeholder: "Enter Company Phone",
  },
  {
    id: 4,
    name: "website",
    label: "Company Website",
    type: "text",
    required: false,
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
    type: "dropdown",
    placeholder: "technology",
  },
  {
    id: 9,
    name: "introduction_video_url",
    label: "Introduction video URL",
    type: "text",
    required: false,
    placeholder: "https://www.example.com/video.mp4",
  },
  // {
  //   id: 10,
  //   name: "network",
  //   label: "Network",
  //   type: "text",
  //   placeholder: "Local Network",
  // },
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
    label: "Profile URL",
    type: "text",
    required: false,
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
  plain = false
}) {
  const [displayPic, setDisplayPic] = useState("");
  const [socials, setSocials] = useState(["", "", "", ""]);
  const [companyProfile, setCompanyProfile] = useState();
  const {
    details,
    loading,
    onTextChange,
    updateCompanyProfile,
    retrievalState,
  } = companyHookProps;
  const { getSectors } = useContext(JobContext) ?? {};

  const [newDetails, setNewDetails] = useState({});
  const [campaignPhotos, setCampaignPhotos] = useState([...details?.company_campaign_photos || []]);
  const [sectorList, setSectorList] = useState([]);

useEffect(()=>{
  if(isOpen){
    setNewDetails(details)
  }
},[isOpen])
  

 
const getCampaignPhotoURL = (e) => {
  const { name } = e.target;
  const files = e.target.files;

  // Validate files
  const validFiles = Array.from(files)?.filter(
    (file) => file.type === "image/jpeg" || file.type === "image/png"
  );

  if (validFiles.length > 0) {
    const updatedList = validFiles.map((file) => ({
      url: URL.createObjectURL(file),
      file,
    }));

    const updatedPhotos = [
      ...(newDetails?.company_campaign_photos || []),
      ...updatedList,
    ];

    const updatedFiles = [
      ...(Array.isArray(newDetails?.company_campaign_photos) ? newDetails?.company_campaign_photos?.map((item) => item) : []),
      ...updatedList.map((item) => item.file),
    ];

    setNewDetails((prevDetails) => ({
      ...prevDetails,
      [name]: updatedFiles,
    }));
    setCampaignPhotos(updatedPhotos);
  } else {
    alert("Please select a valid JPEG or PNG file.");
  }
};

  

  useEffect(() => {
    const init = async () => {
      const jobSectors = await getSectors();
      setSectorList(jobSectors?.sort((a, b) => a?.name?.toLowerCase().localeCompare(b?.name?.toLowerCase())) || [])
    }
    init();
  }, [])
  useEffect(() => {
    if (newDetails?.company_campaign_photos?.length > 0) {
      const newPhotos = newDetails.company_campaign_photos
        .filter((file) => typeof file === "string" || file instanceof File) // Filter invalid entries
        .map((file) => ({
          url: typeof file === "string" ? `${resourceUrl}${file}` : URL.createObjectURL(file),
          file: typeof file === "string" ? null : file, // Set file to null if it's a string
        }));

      setCampaignPhotos(newPhotos);
    }
    //console.log(newDetails)
  }, [newDetails]);

  const handleSubmit = (e) => {
    e.preventDefault();

    updateCompanyProfile(newDetails, () => {
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
  const handleRemovePhoto = (index) => {
    // Remove the selected photo from the campaignPhotos state
    const updatedPhotos = campaignPhotos.filter((_, idx) => idx !== index);

    // Filter out the resourceUrl variable dynamically if present in the strings
    setNewDetails((prevDetails) => ({
      ...prevDetails,
      company_campaign_photos: updatedPhotos.map((photo) => {
        if (photo.file) {
          return photo.file; // Return the File object for new uploads
        }
        // Remove the resourceUrl prefix dynamically
        return photo.url.replace(new RegExp(resourceUrl, 'g'), '').trim();
      }),
    }));

    // Update the campaignPhotos state
    setCampaignPhotos(updatedPhotos);
  };


  return (
    isOpen && (
      <div className={`h-full w-full text-gray-600 text-little flex justify-center items-center bg-gray-600/70 ${!plain && "fixed top-0 left-0 z-10"}`}>
        <div className={`${plain ? "w-full h-full" : "w-[90%] sm:max-w-[600px] h-[90%] rounded-[10px] border"} bg-white p-2 flex flex-col`}>
          {!plain && <IoMdCloseCircle
            onClick={() => setIsOpen(false)}
            className="text-lg place-self-end  cursor-pointer"
          />}
          <div className="w-full px-2 flex gap-[10px] flex-col h-[90%] ">
            <h3 className="font-semibold text-lg border-b pb-2 text-gray-600">{`Update Company Profile`}</h3>

            <form
              onSubmit={handleSubmit}
              className="flex flex-col w-full gap-[10px] h-[95%] overflow-x-auto"
            >
              {/* Logo Input */}
              <div className="flex flex-col">
                <span className="text-sm font-semibold">Company Icon</span>
                <div className="w-[20%] mt-[5px] flex flex-col items-start justify-start relative">
                  <img
                    className="h-[50px] w-[50px] rounded-full"
                    src={
                      displayPic
                        ? displayPic
                        : `${resourceUrl}/${newDetails?.logo_image}`
                    }
                  />
                  <input
                    id="displayPic"
                    name="logo_image"
                    type="file"
                    accept=".jpeg, .png, .jpg,"
                    onChange={(e) => {
                      getImageURL(e, setDisplayPic, setNewDetails);
                    }}
                    className="hidden"
                  />
                  <label
                    htmlFor="displayPic"
                    className="absolute right-12  top-0 cursor-pointer text-primaryColor text-lg"
                  >
                    <FaRegEdit />
                  </label>
                  <small className="text-xs text-gray-500">
                    File size should not exceed 1MB. </small>
                </div>
              </div>

              {/* Basic Form inputs */}
              {basic_inputs?.map((current) => (
                current?.type !== "dropdown" ?
                  <BasicInput
                    data={current}
                    details={newDetails}
                    onTextChange={(e) => setNewDetails({
                      ...newDetails,
                      [e.target.name]: e.target.value,
                    })}
                  key={current.id}
                  required={current?.required}
                  /> : <label>
                <strong>{current.label}</strong>
                <Selector
                  key={current.id}
                  data={sectorList || []}
                  selected={sectorList?.find(one => one.name === newDetails?.sector) || null}
                  setSelected={({ name }) => setNewDetails({ ...details, "sector": name })}
                />
              </label>
              ))}

              {/* Company Profile Text Editor */}
              <div className="flex flex-col gap-[5px]">
                <span className="text-sm font-semibold">Company Profile</span>

                <div className="flex flex-col gap-[3px] mb-[30px] w-full text-gray-600 justify-between ">
                  <ReactQuill
                    placeholder="Enter company details...."
                    value={newDetails?.company_profile}
                    onChange={(text) =>
                      setNewDetails({ ...details, company_profile: text })
                    }
                  />
                </div>
              </div>

              {/* Campaign Photos */}
              <div className="w-full flex flex-col gap-[3px] mt-10">
                <div
                  className="text-sm font-semibold flex w-full justify-between items-center"
                >
                  Company Photos <label
                    htmlFor="currentCampaignPhoto" className="relative overflow-hidden">
                    <FaRegEdit size="24" className="cursor-pointer" />
                    <input
                      name="company_campaign_photos"
                      accept=".jpeg, .png, .jpg,"
                      onChange={getCampaignPhotoURL}
                      id="currentCampaignPhoto"
                      className="hidden absolute w-full h-full"
                      type="file"
                      multiple // Allows multiple file selection
                    />
                  </label>
                </div>


                <section>
                  <div className="w-full min-h-[100px] flex gap-[5px] items-start border-dashed p-2 border overflow-x-auto">
                    {campaignPhotos?.map((current, idx) => (
                      <div
                        key={idx}
                        className="flex-shrink-0 relative h-[80px] w-[80px] border border-gray-300"
                      >
                        <img
                          className="h-full w-full object-cover"
                          src={current.url}
                          alt={`Campaign ${idx}`}
                        />
                        <span
                          onClick={() => handleRemovePhoto(idx)}
                          className="absolute top-[-5px] right-[-5px] bg-red-500 font-bold text-white rounded-full w-5 h-5 flex items-center justify-center cursor-pointer"
                        >
                          <FaTimes size="12" />
                        </span>
                      </div>
                    ))}
                  </div>
                  <small className="text-xs text-gray-500">
                    Images should not exceed 3MB. </small>
                </section>


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
                      socials={newDetails?.social_media}
                      setSocials={setNewDetails}
                    />
                  ))}
                </div>
              </div>

              <FormButton
                width="w-[50%] bg-primaryColor text-gray-200"
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
