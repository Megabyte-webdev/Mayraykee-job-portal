import { resourceUrl } from "../../services/axios-client";
import { FormatPrice } from "../../utils/formmaters";

const ApplicantProfileCard = ({ userData }) => {
  const image = userData?.profile_image
    ? `${resourceUrl}/${userData?.profile_image}`
    : "/placeolder2.png";

  return (
    <aside className="w-full h-fit lg:w-1/4 md:min-w-80 bg-white p-6 shadow-[0_0_2px_#999] mb-4 lg:mb-0">
      <div className="text-center flex flex-wrap gap-3 justify-around">
        <img src={image} className="bg-gray-300 object-contain h-24 w-24 rounded-full" />
        <section>
          <h3 className="text-xl font-bold mt-4">
            {userData?.first_name} {userData?.surname}
          </h3>
          <p className="text-gray-600">{userData?.subcategory}</p>
          <div className="flex items-center mt-2">
            <span className="text-yellow-500">★</span>
            <span className="ml-1">{5}</span>
          </div>
        </section>
      </div>
      <div className="mt-4 bg-gray-100 p-2">
        <div className="flex justify-between gap-2 items-center p-2 border-b ">
          <h4 className="font-bold text-gray-800">Member Since</h4>
          <p className="text-gray-500 text-sm">{userData?.member_since}</p>
        </div>
        <div className="p-3 mt-2 rounded-lg">
          <p className="font-semibold uppercase">{userData?.staff_category}</p>
          <p className="text-gray-500 text-sm uppercase">
            {userData?.subcategory}
          </p>
        </div>
      </div>
      <div className="mt-6">
        <h4 className="font-bold text-gray-800">Primary</h4>
        <ul className="text-gray-600 space-y-3 mt-2 break-all">
          <li>Email: {userData?.email}</li>
          <li>Marital Status: {userData?.marital_status}</li>
          <li>Education: {userData?.education_level}</li>
          <li>Religion: {userData?.religion}</li>
          <li>Location: {userData?.location}</li>
        </ul>
      </div>

      <div className="mt-6">
        <h4 className="font-bold text-gray-800">Work</h4>
        <ul className="text-gray-600 space-y-3 mt-2">
          <li>Employemet Type: {userData?.employment_type}</li>
          <li>Work Days: {userData?.work_days}</li>
          <li>
            Expected Salary: {FormatPrice(Number(userData?.expected_salary))}
          </li>
          <li>
            Current Salary: {FormatPrice(Number(userData?.current_salary))}
          </li>
        </ul>
      </div>

      <div className="mt-6">
        <h4 className="font-bold text-gray-800">Languages</h4>
        <ul className="text-gray-600 mt-2 grid grid-cols-2 gap-1">
          {userData?.languages_spoken.map((current) => (
            <li className="py-1 px-2 bg-yellow-400">{current}</li>
          ))}
        </ul>
      </div>

      <div className="mt-6">
        <h4 className="font-bold text-gray-800">Contact</h4>
        <ul className="text-gray-600 space-y-2 mt-2">
          <li className="flex gap-2 items-center">Email: <span className="break-all">{userData?.email}</span></li>
          {/* <li>Phone: {userData?.phone}</li> 
           <li>Instagram: {userData?.social?.instagram}</li>
          <li>Twitter: {userData?.social?.twitter}</li>
          <li>Website: {userData?.website}</li> */}
        </ul>
      </div>
    </aside>
  );
};

export default ApplicantProfileCard;
