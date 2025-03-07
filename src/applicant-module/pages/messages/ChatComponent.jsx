import { useState, useEffect, useContext, useRef } from "react";
import { BiLoaderCircle } from "react-icons/bi";
import { onValue, ref } from "firebase/database";
import clipIcon from "../../../assets/pngs/clip-icon.png";
import sendIcon from "../../../assets/pngs/send-icon.png";
import { resourceUrl } from "../../../services/axios-client";
import { AuthContext } from "../../../context/AuthContex";
import useCompanyProfile from "../../../hooks/useCompanyProfile";
import useChats from "../../../hooks/useChats";
import { database } from "../../../utils/firebase";
import { IMAGE_URL } from "../../../utils/base";

function ChatComponent({ selectedChat, setSelectedChat, applicationUtils }) {
  // const chatContainer = useRef(null);
  const [currentEmployer, setCurrentEmployer] = useState();
  const { authDetails } = useContext(AuthContext);
  //const [containerWidth, setContainerWidth] = useState("90%");
  const [message, setMessage] = useState("");
  const { details } = useCompanyProfile();
  const { loading, messages, sendMessage, getMessages, setMessages, firebaseMessaging } =
    useChats();

  const onSendButtonClick = () => {
    const messageToSend = {
      sender_id: authDetails.user.id,
      sender_type: authDetails.user.role,
      receiver_id: currentEmployer?.employer_id,
      receiver_type: "employer",
      message: message,
      date_sent: new Date().toDateString(),
    };
    firebaseMessaging(selectedChat.employer_id, messageToSend);

    sendMessage(messageToSend, () => {
      setMessage("");
    });
  };

  // useEffect(() => {
  //   const updateContainerWidth = () => {
  //     if (chatContainer.current) {
  //       setContainerWidth(chatContainer.current.clientWidth);
  //     }
  //   };
  //   updateContainerWidth();
  //   window.addEventListener("resize", updateContainerWidth);
  //   return () => {
  //     window.removeEventListener("resize", updateContainerWidth);
  //   };
  // }, []);

  const openCommunication = () => {
    if (!currentEmployer) return;
    const path = `employer-${selectedChat.employer_id}-candidate-${authDetails.user.id}`;
    const messageRef = ref(database, `messages/` + path);

    onValue(messageRef, (snapshot) => {
      const data = snapshot.val();
      getMessages(currentEmployer.employer_id, () => {});
    });
  };

  useEffect(() => {
    openCommunication();
  }, [currentEmployer]);

  useEffect(() => {
    if (selectedChat) {
      setMessages([]);
      applicationUtils.getCompany(
        selectedChat?.employer_id,
        setCurrentEmployer
      );
    }
    return setCurrentEmployer();
  }, [selectedChat]);

  return (
    currentEmployer && (
      <div
        className="w-full lg:w-3/4 flex flex-col items-center overflow-y-auto relative h-full">
        <div className="h-max border-b flex w-full">
          <div className="flex w-full items-center p-2 gap-[10px]">
            <img
              src={`${resourceUrl}/${currentEmployer?.logo_image}`}
              className="flex-shrink-0 h-[50px] w-[50px] rounded-full bg-gray-300"
            />
            <div className="flex flex-col w-full">
              <h4 className="text-md font-semibold">
                {currentEmployer?.company_name}
              </h4>
              <span className="text-sm text-gray-400">
                {currentEmployer?.sector}
              </span>
            </div>
          </div>
        </div>

        <div className="flex-1 flex w-full flex-col p-2 pb-20 overflow-y-auto">
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <BiLoaderCircle className="animate-spin text-4xl text-primaryColor" />
            </div>
          ) : messages && messages.length !== 0 ? (
            messages.map((current, index) => {
              const getPositions = (sender) => {
                switch (sender) {
                  case "employer":
                    return [
                      "",
                      "",
                      `${resourceUrl}/${currentEmployer.logo_image}`,
                      currentEmployer.company_name,
                    ];
                  default:
                    return [
                      "flex-row-reverse place-self-end",
                      "items-end",
                      `${IMAGE_URL}/${details.logo_image}`,
                    ];
                }
              };

              const positions = getPositions(current.sender_type);
              return (
                <div
                  key={index}
                  className={`flex w-max max-w-60 lg:max-w-72 gap-[10px] mt-3 ${positions[0]}`}
                >
                  <img
                    src={positions[2]}
                    className="flex-shrink-0 h-[30px] w-[30px] rounded-full bg-gray-300"
                  />
                  <div
                    className={`flex flex-col w-max max-w-full ${positions[1]}`}
                  >
                    <span className="text-little font-semibold">
                      {positions[3] ? positions[3] : "you"}
                    </span>
                    <p className="p-2 mt-2 rounded-md bg-gray-200 text-sm">
                      {current.message}
                    </p>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-center text-gray-500">No messages yet.</p>
          )}
        </div>

        <div
          className="flex items-center justify-between bg-white p-2 absolute w-full bottom-0 h-max border-t"
        >
          <img src={clipIcon} className="h-[20px]" alt="Attach" />
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-1 p-2 focus:outline-none text-sm h-10"
            placeholder="Reply Message"
          ></textarea>
          <button
            onClick={onSendButtonClick}
            className="h-fit p-2 w-8 flex justify-center items-center bg-primaryColor text-white rounded-md"
          >
            {loading ? (
              <BiLoaderCircle className="animate-spin text-white" />
            ) : (
              <img src={sendIcon} className="h-[15px]" />
            )}
          </button>
        </div>
      </div>
    )
  );
}

export default ChatComponent;
