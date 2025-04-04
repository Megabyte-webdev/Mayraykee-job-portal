import wheelIcon from "../../assets/pngs/wheel-icon.png";
import plusIcon from "../../assets/pngs/plus-icon.png";
import { useNavigate } from "react-router-dom";
import { PiBellLight, PiBellRingingDuotone } from "react-icons/pi";
import { useContext, useState } from "react";
import { NotificationContext } from "../../context/NotificationContext";
import { useEffect } from "react";
import NotificationsModal from "./NotificationsModal";
import { MdClose, MdMenu } from "react-icons/md";
import { IoGift } from "react-icons/io5";
import SubscriptionModal from "../../components/subscription/SubscriptionModal";
import { CompanyRouteContext } from "../../context/CompanyRouteContext";

function NavBar({ state, toogleIsOpen, isMenuOpen }) {
  const navigate = useNavigate();
  const { notifications, getNotifications } = useContext(NotificationContext) || {};
  const [isOpen, setIsOpen] = useState(false);
  const [isSUbOpen, setIsSUbOpen] = useState(false);
  const { setSideBar } = useContext(CompanyRouteContext);

  useEffect(() => {
    getNotifications();
  }, []);
  return (
    <>
      <NotificationsModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        data={notifications}
      />
      <SubscriptionModal isOpen={isSUbOpen} setIsOpen={setIsSUbOpen} />


      <nav className="w-full h-[8%] px-2 sm:px-4 md:px-8 flex gap-1 items-center justify-between bg-white">

        <MdMenu
          onClick={toogleIsOpen}
          className="text-primarycolor lg:hidden text-3xl"
        />
        <div className="flex items-center gap-[5px] mr-auto">
          <img src={wheelIcon} className="h-[35px] md:block hidden w-[35px]" />
          <h1 className="font-bold text-[16px] md:text-xl leading-none ml-[2px]">{state?.title}</h1>
        </div>

        <div className="flex justify-end items-center pr-2 gap-[5px]">
          <button
            onClick={() => {
              navigate("/company/job-posting")
              setSideBar(9)
            }}
            className="border px-[5px] flex py-[5px] font-semibold justify-center items-center gap-[3px] text-sm bg-primaryColor text-white"
          >
            <img src={plusIcon} className="h-[15px] w-[15px]" />
            Post a Job
          </button>
          {/* {notifications?.length === 0 || !notifications ? (
            <PiBellLight
              onClick={() => setIsOpen(true)}
              className="text-lg cursor-pointer mx-2"
            />
          ) : (
            <PiBellRingingDuotone
              onClick={() => setIsOpen(true)}
              className="text-primaryColor cursor-pointer text-lg animate-bounce md:mx-2"
            />
          )} */}

          {/*<button onClick={() => setIsSUbOpen(true)} className="flex gap-2 items-center md:px-2">
             <span className="hidden md:block"> Subscribe </span> 
            <IoGift size="20" className="animate-bounce" />
          </button>*/}


        </div>
      </nav>
    </>
  );
}

export default NavBar;
