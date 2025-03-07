import { MdClose } from "react-icons/md";
import PopUpBox from "../../../components/PopUpBox";
import SocialMediaInput from "../../../company-module/components/company-profile/SocialMediaInput";
import FormButton from "../../../components/FormButton";
import { FaRegEdit, FaTimes } from "react-icons/fa";
import ReactQuill from "react-quill";
import BasicInput from "../../../company-module/components/company-profile/BasicInput";
import {
  basic_inputs,
  social_media_inputs,
} from "../../../company-module/components/company-profile/UpdateCompanyProfileModal";
import useExclusiveProfile from "../../../hooks/useExclusiveProfile";
import { useContext, useEffect, useState } from "react";
import { axiosClient, resourceUrl } from "../../../services/axios-client";
import { getImageURL } from "../../../utils/formmaters";
import { AuthContext } from "../../../context/AuthContex";
import { JobContext } from "../../../context/JobContext";
import Selector from "../../../components/Selector";
import { useNavigate } from "react-router-dom";

function UpdateExclusiveProfileModal({
  toogleProfileUpdateModal,
  isOpen,
  exclusive,
}) {
  const navigate=useNavigate()
  const {
    details,
    setDetails,
    loading,
    onTextChange,
    updateCompanyProfile,
    getProfile,
    retrievalState,
  } = useExclusiveProfile(exclusive.id);
  const [displayPic, setDisplayPic] = useState("");
  const [campaignPhotos, setCampaignPhotos] = useState([...details?.company_campaign_photos || []]);
  
  const { authDetails } = useContext(AuthContext);
  const client = axiosClient(authDetails?.token, true);
  const { getSectors } = useContext(JobContext);
  const [sectorList, setSectorList] = useState([]);


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
        ...(details?.company_campaign_photos || []),
        ...updatedList,
      ];

      const updatedFiles = [
        ...(Array.isArray(details?.company_campaign_photos) ? details?.company_campaign_photos?.map((item) => item) : []),
        ...updatedList.map((item) => item.file),
      ];

      setDetails((prevDetails) => ({
        ...prevDetails,
        [name]: updatedFiles,
      }));
      setCampaignPhotos(updatedPhotos);

      console.log("Updated Campaign Photos:", updatedPhotos);
    } else {
      alert("Please select a valid JPEG or PNG file.");
    }
  };

  useEffect(() => {
    const init = async () => {
      const jobSectors = await getSectors();
      setSectorList(jobSectors || [])
    }
    init();
  }, [])
  useEffect(() => {
    if (details?.company_campaign_photos?.length > 0) {
      const newPhotos = details.company_campaign_photos
        .filter((file) => typeof file === "string" || file instanceof File) // Filter invalid entries
        .map((file) => ({
          url: typeof file === "string" ? `${resourceUrl}${file}` : URL.createObjectURL(file),
          file: typeof file === "string" ? null : file, // Set file to null if it's a string
        }));

      setCampaignPhotos(newPhotos);
    }
    //console.log(details)
  }, [details]);

  const handleSubmit = (e) => {
    e.preventDefault();

    updateCompanyProfile(() => {
      toogleProfileUpdateModal();
      navigate(`/admin-exclusives/profile/${details.employer_id}`)
    });
  };

  useEffect(() => {
    const initData = async () => {
      const { data } = await client.get(
        `/employer/getEmployer/${exclusive.id}`
      );

      // Check and handle data.details safely
      if (
        data.details &&
        typeof data.details === "object" &&
        !Array.isArray(data.details)
      ) {
        console.log(data.details);
        setDetails(() => {
          const test = data.details;
          const neww = {
            ...test,
            beenRetreived: 2,
          };
          return neww;
        });
      }
    };

    // initData()
  }, []);

  const handleRemovePhoto = (index) => {
    // Remove the selected photo from the campaignPhotos state
    const updatedPhotos = campaignPhotos.filter((_, idx) => idx !== index);

    // Filter out the resourceUrl variable dynamically if present in the strings
    setDetails((prevDetails) => ({
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
    <PopUpBox isOpen={isOpen}>
      <div className="bg-white w-[90%] max-w-[600px] rounded-md h-[95%] px-3  py-3">
        <button
          onClick={toogleProfileUpdateModal}
          className="flex gap-1 border px-1 rounded-lg py-1 items-center bg-red-500 text-white font-semibold"
        >
          <MdClose /> Close Form
        </button>
        <div className="w-full px-2 flex gap-[10px] flex-col h-[90%] ">
          <h3 className="font-bold text-lg border-b py-2 ">{`Update Exlusive Profile`}</h3>

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
                        : `${resourceUrl}/${details?.logo_image}`
                    }
                  />
                  <input
                    id="displayPic"
                    name="logo_image"
                    type="file"
                    accept=".jpeg, .png, .jpg,"
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
                  <small class="text-xs text-gray-500">
                File size should not exceed 1MB. </small>
                </div>
              </div>

            {/* Basic Form inputs */}
            {basic_inputs?.map((current) => (
              current?.type !== "dropdown" ?
                <BasicInput
                  data={current}
                  details={details}
                  onTextChange={onTextChange}
                  key={current.id}
                  required={current?.required}
                /> : <label>
                  <strong>{current.label}</strong>
                  <Selector
                    key={current.id}
                    data={sectorList || []}
                    selected={sectorList?.find(one => one.name === details?.sector) || null}
                    setSelected={({ name }) => setDetails({ ...details, "sector": name })}
                  />
                </label>
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
                <small class="text-xs text-gray-500">
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
                {social_media_inputs.map((current) => (
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
    </PopUpBox>
  );
}

export default UpdateExclusiveProfileModal;
