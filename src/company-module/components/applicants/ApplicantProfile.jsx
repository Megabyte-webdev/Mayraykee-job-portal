import { formatDate } from "../../../utils/formmaters";

function ApplicantProfile({ data, applicant }) {
  return (
    <div className="w-full flex flex-col items-center">
      {/* Personal Info Section */}
      <div className="w-full md:w-[80%] flex flex-col mb-4">
        <h3 className="font-semibold text-sm px-2">Personal Info</h3>

        <ul className="grid grid-cols-1 md:grid-cols-3 text-black gap-y-2 px-2 mt-1">
          <li className="flex flex-col">
            <span className="text-gray-800 text-sm">Full Name</span>
            <span className="font-semibold text-xs">
              {data?.full_name}
            </span>
          </li>
          <li className="flex flex-col">
            <span className="text-gray-800 text-sm">Date of Birth</span>
            <span className="font-semibold text-xs">
              {formatDate(applicant?.date_of_birth)}
            </span>
          </li>
          <li className="flex flex-col">
            <span className="text-gray-800 text-sm">Email</span>
            <span className="font-semibold text-xs">
              {applicant?.email}
            </span>
          </li>
          <li className="flex flex-col">
            <span className="text-gray-800 text-sm">Gender</span>
            <span className="font-semibold text-xs">
              {applicant?.gender}
            </span>
          </li>
          <li className="flex flex-col">
            <span className="text-gray-800 text-sm">Languages</span>
            <span className="font-semibold text-xs">
              {applicant?.languages}
            </span>
          </li>
          <li className="flex flex-col">
            <span className="text-gray-800 text-sm">Phone</span>
            <span className="font-semibold text-xs">
              {applicant?.phone_number}
            </span>
          </li>
          <li className="flex flex-col md:col-span-3">
            <span className="text-gray-800 text-sm">Address</span>
            <span className="font-semibold text-xs">
              {applicant?.contact_address}
            </span>
          </li>
        </ul>
      </div>
      
      <hr className="h-px bg-gray-300 w-full mb-4" />

      {/* Professional Info Section */}
      <div className="w-full md:w-[80%] flex flex-col">
        <h3 className="font-semibold text-sm px-2">Professional Info</h3>

        <span className="text-sm px-2 text-gray-800 mt-2">About me</span>
        <div className="flex flex-col px-2 mt-1 gap-1">
          <p className="text-xs">
            {applicant?.personal_profile}
          </p>
        </div>

        <ul className="grid grid-cols-1 md:grid-cols-2 gap-y-2 px-2 mt-2">
          <li className="flex flex-col">
            <span className="text-gray-800 text-sm">Current Job</span>
            <span className="font-semibold text-xs">
              Product Designer
            </span>
          </li>
          <li className="flex flex-col">
            <span className="text-gray-800 text-sm">Work Experience</span>
            <span className="font-semibold text-xs">
              {applicant?.work_experience}
            </span>
          </li>
          <li className="flex flex-col md:col-span-2">
            <span className="text-gray-800 text-sm">Certification Held</span>
            <div
              className="text-xs font-semibold"
              dangerouslySetInnerHTML={{ __html: data?.educational_qualification }}
            />
          </li>
        </ul>
      </div>
    </div>
  );
}

export default ApplicantProfile;
