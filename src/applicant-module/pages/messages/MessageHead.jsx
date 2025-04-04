import { useContext, useState, useEffect } from "react";
import { onValue, ref } from "firebase/database";
import { ChatContext } from "../../../context/ChatContext";
import { database } from "../../../utils/firebase";


function MessageHead({current, selectedChat, setSelectedChat}) {
  const [onlineStatus, setOnlineStatus] = useState(false);
  const {
    loading,
    messages,
    sendMessage,
    getMessages,
    initFirebaseChatSession,
  } = useContext(ChatContext);

  const watchOnlineStatus = (currentEmployer) => {
    const onlineStatusRef = ref(
      database,
      "online-status/" + `employer-${currentEmployer.employer_id}`
    );
    onValue(onlineStatusRef, (snapshot) => {
      const data = snapshot.val();
      if (data && data?.isOnline) {
        setOnlineStatus(true);
      } else {
        setOnlineStatus(false);
      }
    });
  };

  useEffect(() => {
    initFirebaseChatSession(current.employer_id);
    watchOnlineStatus(current);
  }, []);
  return (
    <li
      key={current.id}
      onClick={() => setSelectedChat(current)}
      className={`border-l border-r lg:border-0 lg:border-b lg:items-center min-w-20 lg:w-full flex ${
        selectedChat?.id === current.id
          ? "bg-primaryColor text-white"
          : "bg-opacity-0 text-black hover:bg-gray-100 hover:text-black "
      } cursor-pointer px-2 justify-between items-start gap-[10px]  border-b min-h-[50px]`}
    >
      {/* <img src={`${resourceUrl}/${current.}`} className="h-[35px] w-[35px] rounded-full bg-gray-300" /> */}
      <div className="flex flex-col h-fit">
        <h4 className="text-sm font-semibold">{current?.employer_name}</h4>
        {onlineStatus && (
          <div className="truncate flex flex-col h-full">
            <h4 className="text-sm font-semibold">{current?.full_name}</h4>
            <span className="text-little font-thin italic pb-1 text-green-600">online</span>
          </div>
        )}{" "}
      </div>
    </li>
  );
}

export default MessageHead;
