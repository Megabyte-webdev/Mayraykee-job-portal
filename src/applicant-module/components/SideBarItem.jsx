import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContex";
import { ChatContext } from "../../context/ChatContext";

function SideBarItem({ data, dispatch, state, setIsOpen }) {
  const navigate = useNavigate();
  const { setAuthDetails } = useContext(AuthContext);
  const { hasNewMessage } = useContext(ChatContext);

  const navigateToPage = () => {
    if (data.type === "LOG-OUT") {
      sessionStorage.clear();
      dispatch({});
      setAuthDetails(null);
      navigate(data.route, { replace: true });
    } else {
      dispatch({ ...data });
      navigate(data.route);
    }
    setIsOpen(false);
  };

  return (
    <li
      onClick={navigateToPage}
      className={`relative cursor-pointer flex gap-[10px] hover:bg-green-800 group items-center z-10 p-[5px] ${
        state?.type === data?.type ? "bg-primaryColor" : "bg-none"
      }`}
    >
      <img
        className="h-[20px] w-[20px]"
        src={state?.type === data?.type ? data.iconActive : data.icon}
      />
      <span
        className={`${
          state?.type === data?.type ? "text-white" : "text-primary"
        } text-sm group-hover:text-white`}
      >
        {data.title}
      </span>

      {/* Show a red dot for new messages */}
      {data.title === "Messages" && hasNewMessage && (
        <span className="absolute top-0 bottom-0 my-auto h-max right-2 px-2 bg-red-500 text-white font-medium rounded-full flex items-center justify-center">{hasNewMessage}</span>
      )}
    </li>
  );
}

export default React.memo(SideBarItem);
