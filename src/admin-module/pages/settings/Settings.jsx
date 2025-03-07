import { BsEye, BsGift, BsNewspaper, BsStopwatch, BsToggles } from "react-icons/bs";
import SettingsCard from "../../components/Settings/SettingsCard";
import { FaFile, FaMoneyBill, FaPlus } from "react-icons/fa";
import { TbBrandGoogleAnalytics, TbShieldHalf } from "react-icons/tb";
import { GrAnnounce } from "react-icons/gr";
function Settings() {
    return (
        <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6 py-4">
            <SettingsCard
                    rightIcon={<BsNewspaper />}
                    title="Manage Subscription Packages"
                    subtitle="Add all the subscription plans"
                    smallTextIcon={<FaPlus/>}
                    link="/admin/settings/packages"
                     />
                <SettingsCard
                    rightIcon={<BsNewspaper />}
                    title="Manage Job Sectors"
                    subtitle="Add all the sectors and subsectors available for job"
                    smallTextIcon={<FaPlus/>}
                    link="/admin/settings/sectors"
                     />
                     <SettingsCard
                    rightIcon={<BsNewspaper />}
                    title="Manage Staff Sectors"
                    subtitle="Add all the sectors and subsectors available for staff"
                    smallTextIcon={<FaPlus/>}
                    link="/admin/settings/staff-sectors"
                     />
                <SettingsCard
                    rightIcon={<TbShieldHalf/>}
                    title="Login and Security"
                    subtitle="Update your password and secure your account"
                    smallTextIcon={<FaPlus/>}
                    link="/admin/settings/security"
                     />
                <SettingsCard
                    rightIcon={<FaMoneyBill />}
                    title="Payments & payouts"
                    subtitle="Review payments, payouts, coupons, and gift cards"
                    smallTextIcon={<FaPlus/>}
                    link=""
                     />
                <SettingsCard
                    rightIcon={<FaFile />}
                    title="Manage Salary type"
                    subtitle="Manage taxpayer information and tax documents"
                    smallTextIcon={<FaPlus/>}
                    link="/admin/settings/salary"
                     />
                <SettingsCard
                    rightIcon={<GrAnnounce/>}
                    title="Notifications"
                    subtitle="Choose notification preferences and how you want to be contacted"
                    smallTextIcon={<FaPlus/>}
                    link=""
                     />
                <SettingsCard
                    rightIcon={<BsEye />}
                    title="Privacy & Settings"
                    subtitle="Manage your personal data, connected services, and data sharing settings"
                    smallTextIcon={<FaPlus/>}
                    link=""
                     />
                <SettingsCard
                    rightIcon={<BsToggles />}
                    title="Global preferences"
                    subtitle="Set your default language, currency, and timezone"
                    smallTextIcon={<FaPlus/>}
                    link=""
                     />
                <SettingsCard
                    rightIcon={<svg width="31" height="29" className="text-green-500" viewBox="0 0 31 29"  fill="currentColor"  xmlns="http://www.w3.org/2000/svg">
                        <path d="M25.5 5.80314e-08C25.6969 -6.69923e-05 25.8894 0.0579706 26.0534 0.166839C26.2174 0.275708 26.3456 0.430564 26.422 0.612L26.462 0.725L28.462 7.725C28.502 7.86457 28.5111 8.01117 28.4888 8.15463C28.4664 8.29808 28.4131 8.43495 28.3325 8.55571C28.2519 8.67647 28.1459 8.77823 28.022 8.85392C27.8981 8.92961 27.7592 8.97741 27.615 8.994L27.5 9H24.5V14H30.5V16H28.5V29H26.5L26.501 26.464C25.9725 26.7702 25.3805 26.9506 24.771 26.991L24.5 27H6.5C5.79782 27.0011 5.10784 26.8166 4.5 26.465V29H2.5V16H0.5V14H5.5V10C5.50003 9.75507 5.58996 9.51866 5.75272 9.33563C5.91547 9.15259 6.13975 9.03566 6.383 9.007L6.5 9H6.738L5.586 6.406L7.414 5.594L8.927 9H11.5C11.7449 9.00003 11.9813 9.08996 12.1644 9.25272C12.3474 9.41547 12.4643 9.63975 12.493 9.883L12.5 10V14H22.5V9H19.5C19.355 9.00003 19.2116 8.96851 19.08 8.90762C18.9483 8.84673 18.8315 8.75793 18.7376 8.64738C18.6437 8.53683 18.575 8.40718 18.5362 8.26742C18.4974 8.12766 18.4895 7.98113 18.513 7.838L18.538 7.725L20.538 0.725C20.5921 0.535735 20.7009 0.366646 20.8506 0.238923C21.0004 0.111199 21.1846 0.0305213 21.38 0.00700003L21.5 5.80314e-08H25.5ZM26.5 16H4.5V23C4.49998 23.4779 4.67111 23.9401 4.98241 24.3027C5.2937 24.6654 5.72458 24.9046 6.197 24.977L6.351 24.995L6.5 25H24.5C25.0046 25.0002 25.4906 24.8096 25.8605 24.4665C26.2305 24.1234 26.4572 23.6532 26.495 23.15L26.5 23V16ZM10.5 11H7.5V14H10.5V11ZM24.745 2H22.254L20.825 7H26.174L24.745 2Z"/>
                        </svg>
                        }
                    title="Manage Currency"
                    subtitle="Add a work email for business trip benefits"
                    smallTextIcon={<FaPlus/>}
                    link="/admin/settings/currency"
                     />
                <SettingsCard
                    rightIcon={<TbBrandGoogleAnalytics/>}
                    title="Professional hosting tools"
                    subtitle="Get professional tools if you manage several properties on Airbnb"
                    smallTextIcon={<FaPlus/>}
                    link=""
                     />
                <SettingsCard
                    rightIcon={<BsGift />}
                    title="Referral credit & coupon"
                    subtitle="You have $0 referral credits and coupon. Learn more."
                    smallTextIcon={<FaPlus/>}
                    link=""
                     />
            </div>


        </>);
}

export default Settings;