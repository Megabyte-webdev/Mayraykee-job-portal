import wheelIcon from "../../assets/pngs/wheel-icon.png";
import { PiBellLight, PiBellRingingDuotone } from "react-icons/pi";
import { useContext, useState, useEffect } from "react";
import NotificationsModal from "../../company-module/components/NotificationsModal";
import UseAdminManagement from "../../hooks/useAdminManagement";
import { ResourceContext } from "../../context/ResourceContext";
import { MdClose, MdMenu } from "react-icons/md";

function NavBar({ state, toogleIsOpen, isMenuOpen }) {
  const { getSupport, loading } = UseAdminManagement();
  const {
    notifications,
    setNotifications
  } = useContext(ResourceContext);
  const [isOpen, setIsOpen] = useState(false);

  // Function to fetch support data
  const fetchSupport = async () => {
    try {
      const res = await getSupport();
      // Transform fetched data to match the modal's expected structure
      const formattedNotifications = res?.filter(item => item.status !== "Resolved").map(item => ({
        id: item.id,
        message: item.message,
        from: item.name || item.email,  // Display sender's name or email
        timestamp: new Date(item.created_at).toLocaleString(),  // Format timestamp
        link: "/admin/support"
      }));
      setNotifications(formattedNotifications);
    } catch (err) {
      console.error("Error fetching notifications:", err.message);
    }
  };

  // useEffect for polling every 10 seconds to fetch new notifications
  useEffect(() => {
    fetchSupport(); // Fetch immediately when the component mounts

    const interval = setInterval(() => {
      fetchSupport(); // Poll every 10 seconds for new data
    }, 10000); // 10 seconds interval

    // Cleanup the interval when the component unmounts
    return () => clearInterval(interval);
  }, []); // Empty dependency array to run only once on mount

  return (
    <>
      <NotificationsModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        data={notifications}
      />
      <nav className="w-full h-[8%] px-2 md:px-12 flex items-center justify-between bg-white">
        <MdMenu
          onClick={toogleIsOpen}
          className="text-primarycolor md:hidden text-3xl"
        />
        <div className="flex items-center gap-[5px]">
          <img src={wheelIcon} className="h-[35px] md:block hidden w-[35px]" />
          <h1 className="font-semibold text-xl tracking-wide">{state.title}</h1>
        </div>

        <div className="flex justify-end items-center pr-2 md:w-[25%] gap-[5px]">
          {notifications?.length === 0 || !notifications ? (
            <PiBellLight
              onClick={() => setIsOpen(true)}
              className="text-lg cursor-pointer"
            />
          ) : (
            <PiBellRingingDuotone
              onClick={() => setIsOpen(true)}
              className="text-primaryColor cursor-pointer text-lg animate-bounce"
            />
          )}
        </div>
      </nav>
    </>
  );
}

export default NavBar;
