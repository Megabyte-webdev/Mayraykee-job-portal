import { MdClose } from "react-icons/md";
import PopUpBox from "../../../components/PopUpBox";
import SocialMediaInput from "../../../company-module/components/company-profile/SocialMediaInput";
import FormButton from "../../../components/FormButton";
import { FaRegEdit } from "react-icons/fa";
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

function UpdateExclusiveProfileModal({
  toogleProfileUpdateModal,
  isOpen,
  exclusive,
}) {
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
  const [campaignPhotos, setCampaignPhotos] = useState([
    ...details?.company_campaign_photos,
  ]);
  const { authDetails } = useContext(AuthContext);
  const client = axiosClient(authDetails?.token, true);

  const getCampaingPhotoURL = (e) => {
    const { name } = e.target;
    const file = e.target.files[0]; //filelist is an object carrying all details of file, .files[0] collects the value from key 0 (not array), and stores it in file

    if (file && (file.type === "image/jpeg" || file.type === "image/png")) {
      // You can also perform additional actions with the valid file
      const generatedUrl = URL.createObjectURL(file);
      if (campaignPhotos.length <= 0) return;
      const list = [...campaignPhotos, { url: generatedUrl, file: file }];
      const files = list.map((current) => current.file);
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
      toogleProfileUpdateModal();
      window.location.reload();
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

  return (
    <PopUpBox isOpen={isOpen}>
      <div className="bg-white w-[60%] rounded-md h-[95%] px-3  py-3">
        <button
          onClick={toogleProfileUpdateModal}
          className="flex gap-1 border px-1 mb-3 rounded-lg py-1 items-center"
        >
          <MdClose /> Close Form
        </button>
        <div className="w-full px-2 flex gap-[10px] flex-col h-[90%] ">
          <h3 className="font-semibold text-lg border-b pb-2 text-gray-600">{`Update Exlusive Profile`}</h3>

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
            {basic_inputs.map((current) => (
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
                  <img
                    key={idx}
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
