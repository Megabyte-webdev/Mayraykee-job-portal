import { BsEye, BsGift, BsNewspaper, BsStopwatch, BsToggles } from "react-icons/bs";
import { FaFile, FaMoneyBill, FaPlus } from "react-icons/fa";
import { TbBrandGoogleAnalytics, TbShieldHalf } from "react-icons/tb";
import { GrAnnounce } from "react-icons/gr";
import SettingsCard from "../../../components/Settings/SettingsCard";
import { FaArrowLeftLong } from "react-icons/fa6";

function Security() {
    return (
        <>
        <button
        type="button"
        onClick={() => window.history.back()}
        className="my-2 flex items-center gap-2 outline outline-offset-5 outline-green-500 px-4 py-2 rounded text-green-500 hover:bg-green-100"
      >
        <FaArrowLeftLong className="me-4 text-green-500" />Back
      </button>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
                <SettingsCard
                    rightIcon={<BsNewspaper />}
                    title="All Admins"
                    subtitle="Get and update all Admins here "
                    smallTextIcon={<FaPlus/>}
                    link="/admin/settings/security/admins"
                     />
                <SettingsCard
                    rightIcon={<TbShieldHalf/>}
                    title="Register"
                    subtitle="Click here to register "
                    smallTextIcon={<FaPlus/>}
                    link="/admin/settings/register"
                     />
                <SettingsCard
                    rightIcon={<TbShieldHalf/>}
                    title="Change Password"
                    subtitle="Update your password and secure your account"
                    smallTextIcon={<FaPlus/>}
                    link="/admin/change-pwd"
                     />
                     
              
            </div>


        </>);
}

export default Security;