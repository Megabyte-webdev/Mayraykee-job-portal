import { Helmet } from "react-helmet";
import { CiFlag1, CiInstagram } from "react-icons/ci";
import { FaRegEdit } from "react-icons/fa";
import { GrLocation } from "react-icons/gr";
import { MdOutlineEmail, MdOutlinePhoneIphone } from "react-icons/md";
import { IoLanguageOutline } from "react-icons/io5";
import { useContext, useEffect } from "react";
import { AuthContext } from "../../../context/AuthContex";
import UpdateCandidateProfile from "../settings/components/UpdateCandidateProfile";
import { ResourceContext } from "../../../context/ResourceContext";
import { BASE_URL, IMAGE_URL } from "../../../utils/base";

function PublicProfile() {
  const { getCandidate, setGetCandidate } = useContext(ResourceContext);
  const { authDetails } = useContext(AuthContext);
  const user = authDetails?.user;

  useEffect(() => {
    setGetCandidate((prev) => ({
      ...prev,
      isDataNeeded: true,
    }));
  }, []);

  const candidate = getCandidate.data?.details;
  const bgImage = candidate?.background_profile
    ? `url('${IMAGE_URL}/${candidate?.background_profile}')`
    : "";

  return (
    <>
      <Helmet>
        <title>Dashboard | Public Profile</title>
      </Helmet>
      <div className="h-full w-full">
        <div className="flex flex-wrap lg:flex-nowrap">
          <div className="w-full lg:w-2/3 mb-4 lg:mb-0">
            <div className="border rounded-lg overflow-hidden">
              <div
                className="bg_layout p-4 h-[150px] bg-cover"
                style={{ backgroundImage: bgImage }}
              >
                <div className="flex justify-end text-white">
                  {/* <button className="p-1 border border-white hover:text-gray-200"><FaRegEdit /></button> */}
                </div>
              </div>
              <div className="p-4 flex flex-col md:flex-row">
                <div className="flex-shrink-0 mt-[-70px]">
                  <img
                    src={
                      candidate?.profile
                        ? `${IMAGE_URL}/${candidate.profile}`
                        : "https://via.placeholder.com/150"
                    }
                    className="w-24 h-24 md:w-32 md:h-32 object-cover rounded-full ring-4 ring-white"
                    alt="profile"
                  />
                </div>

                <div className="flex-1 mt-4 md:mt-0 md:ml-4">
                  <h4 className="text-lg font-bold">{candidate?.full_name}</h4>
                  <div className="text-sm text-gray-600 mt-2">
                    <p>{candidate?.preferred_job_role}</p>
                    <div className="flex items-center mt-2">
                      <GrLocation className="mr-2" />
                      <span>
                        {candidate?.state}, {candidate?.country}
                      </span>
                    </div>
                    <p className="mt-2">
                      <b>Address:</b> {candidate?.contact_address}
                    </p>
                    <p className="mt-2">
                      <b>Educational Qualification:</b>{" "}
                      {candidate?.educational_qualification?.toUpperCase()}
                    </p>
                  </div>
                  <button className="mt-5 px-4 py-2 flex items-center bg-green-100 hover:bg-green-200 text-green-900 rounded">
                    <CiFlag1 className="mr-2" />
                    OPEN FOR OPPORTUNITIES
                  </button>
                </div>
                <div className="mt-4 md:mt-0">
                  <UpdateCandidateProfile />
                </div>
              </div>
            </div>
            <div className="border rounded-lg mt-4">
              <div className="p-4">
                <p className="font-bold">About Me</p>
                <p className="text-sm text-gray-600 mt-3">
                  {candidate?.personal_profile}
                </p>
              </div>
            </div>
            <div className="border rounded-lg mt-4">
              <div className="p-4">
                <p className="font-bold">Experience</p>
                <div className="text-sm text-gray-600 mt-3">
                  <p
                    dangerouslySetInnerHTML={{ __html: candidate?.experience }}
                  />
                </div>
              </div>
            </div>
            <div className="border rounded-lg mt-4">
              <div className="p-4">
                <p className="font-bold mb-4">Keywords</p>
                <div className="flex flex-wrap">
                  {[
                    "Communication",
                    "Analytics",
                    "Facebook Ads",
                    "Content Planning",
                    "Community Manager",
                  ].map((keyword) => (
                    <button
                      key={keyword}
                      className="p-2 m-1 bg-green-100 hover:bg-green-200 text-green-900 rounded"
                    >
                      {keyword}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="w-full lg:w-1/3 px-0 lg:px-4">
            <div className="border rounded-lg p-4 mb-4">
              <p className="font-bold">Additional Details</p>
              <div className="flex items-center text-gray-600 mt-3">
                <MdOutlineEmail className="mr-2" />
                <div>
                  <p>Email</p>
                  <p>{user?.email}</p>
                </div>
              </div>
              <div className="flex items-center text-gray-600 mt-3">
                <MdOutlinePhoneIphone className="mr-2" />
                <div>
                  <p>Phone</p>
                  <p>{candidate?.phone_number}</p>
                </div>
              </div>
              <div className="flex items-center text-gray-600 mt-3">
                <IoLanguageOutline className="mr-2" />
                <div>
                  <p>Language</p>
                  <p className="capitalize">{candidate?.languages}</p>
                </div>
              </div>
            </div>
            <div className="border rounded-lg p-4">
              <p className="font-bold">Social Links</p>
              {candidate?.social_media_handle?.map((social) => (
                <div
                  key={social.url}
                  className="flex items-center text-gray-600 mt-3"
                >
                  <div className="w-full">
                    <p className="font-medium">{social.network}</p>
                    <a
                      href={social.url}
                      className="text-green-700 cursor-pointer w-full block truncate"
                      style={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {social.url}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default PublicProfile;
