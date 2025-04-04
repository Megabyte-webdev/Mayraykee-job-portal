import { clear } from "idb-keyval";
import React, {useContext} from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContex";

function SideBarItem({ data, dispatch, state, setIsOpen }) {
  const navigate = useNavigate();
const {setAuthDetails} = useContext(AuthContext)
  const navigateToPage = () => {
    if (data.type === "LOG-OUT") {
      clear()
      sessionStorage.clear()
      dispatch({});
      setAuthDetails(null)
      navigate(data.route, { replace: true });
    } else {
      dispatch({ ...data });
      navigate(data.route)
      setIsOpen(false);
      
    }
  };

  return (
    <li
      onClick={navigateToPage}
      className={`cursor-pointer flex gap-[10px] hover:bg-green-800 group items-center z-10 p-[5px] ${
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
    </li>
  );
}

export default React.memo(SideBarItem);
