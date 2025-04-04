import { useState, useEffect, useContext, useRef } from "react";
import clipIcon from "../../../assets/pngs/clip-icon.png";
import sendIcon from "../../../assets/pngs/send-icon.png";
import { resourceUrl } from "../../../services/axios-client";
import { AuthContext } from "../../../context/AuthContex";
import useCompanyProfile from "../../../hooks/useCompanyProfile";
import { ChatContext } from "../../../context/ChatContext";
import { onValue, ref } from "firebase/database";
import { database } from "../../../utils/firebase";
import { BiLoaderCircle } from "react-icons/bi";
import { toast } from "react-toastify";

function ChatComponent({ selectedChat, setSelectedChat, applicationUtils }) {
  const chatContainer = useRef(null);
  const [containerWidth, setContainerWidth] = useState("90%");
  const [currentCandidate, setCurrentCandidate] = useState(null);
  const { authDetails } = useContext(AuthContext);
  const [message, setMessage] = useState("");

  const { details } = useCompanyProfile();
  const { loading, sendingMessage, messages, sendMessage, setMessages, getMessages, firebaseMessaging } =
    useContext(ChatContext);

  const onSendButtonClick = () => {
    if (message == "") {
      toast.error("Enter a message");
      return
    }
    const messageToSend = {
      sender_id: authDetails.user.id,
      sender_type: authDetails.user.role,
      receiver_id: currentCandidate?.candidate_id,
      receiver_type: "candidate",
      message: message,
      date_sent: new Date().toDateString(),
    };
    firebaseMessaging(selectedChat.candidate_id, messageToSend);
    sendMessage(messageToSend, () => {
      setMessage("");
    });
  };

  const openCommunication = () => {
    if (!currentCandidate) return;

    const path = `employer-${authDetails.user.id}-candidate-${selectedChat.candidate_id}`;
    const messageRef = ref(database, `messages/${path}`);

    onValue(messageRef, (snapshot) => {
      const data = snapshot.val();
      getMessages(currentCandidate.candidate_id, () => { });
      console.log("Message Data", data);
    });
  };

  useEffect(() => {
    openCommunication();
  }, [currentCandidate]);

  useEffect(() => {
    if (selectedChat) {
      setMessages([])
      applicationUtils.getApplicant(
        selectedChat.candidate_id,
        setCurrentCandidate
      );
    }
    return () => setCurrentCandidate(null);
  }, [selectedChat]);

  useEffect(() => {
    const updateContainerWidth = () => {
      if (chatContainer.current) {
        setContainerWidth(chatContainer.current.clientWidth);
      }
    };

    updateContainerWidth();
    window.addEventListener("resize", updateContainerWidth);

    return () => {
      window.removeEventListener("resize", updateContainerWidth);
    };
  }, []);

  return (
    <div
      ref={chatContainer}
      className="w-full lg:w-3/4 flex flex-col items-center overflow-y-auto chat-container relative"
    >
      {/* Loader for messages */}
      {loading && (
        <div className="flex justify-center items-center h-full w-full">
          <BiLoaderCircle className="animate-spin text-4xl text-primaryColor" />
        </div>
      )}

      {!loading && currentCandidate && (
        <>
          {/* Chat Header */}
          <div className="h-max border-b flex w-full">
            <div className="flex w-full items-center p-2 gap-[10px]">
              <img
                src={`${resourceUrl}/${currentCandidate?.profile}`}
                className="h-[50px] w-[50px] rounded-full bg-gray-300 border border-gray-500"
                alt="Profile"
              />
              <div className="flex flex-col">
                <h4 className="text-md font-semibold">
                  {currentCandidate?.full_name}
                </h4>
                <span className="text-sm text-gray-400">
                  {selectedChat.job_title} Role
                </span>
              </div>
            </div>
          </div>

          {/* Chat Messages */}
          <ul className="flex-1 flex w-full flex-col p-2 pb-20 overflow-y-auto">
            {messages &&
              messages.map((current, index) => {
                const getPositions = (sender) => {
                  return sender === "candidate"
                    ? [
                      "",
                      "",
                      `${resourceUrl}/${currentCandidate.profile}`,
                      currentCandidate.full_name.split(" ", 1),
                    ]
                    : [
                      "flex-row-reverse place-self-end",
                      "items-end",
                      `${resourceUrl}/${details.logo_image}`,
                      "You",
                    ];
                };

                const positions = getPositions(current.sender_type);

                return (
                  <li
                    key={index}
                    className={`flex w-[60%] lg:w-[50%] gap-[10px] mt-3 ${positions[0]}`}
                  >
                    <img
                      src={positions[2]}
                      alt="Avatar"
                      className="flex-shrink-0 h-[30px] w-[30px] rounded-full bg-gray-300"
                    />
                    <div
                      className={`flex flex-col w-max max-w-full ${positions[1]}`}
                    >
                      <span className="text-sm font-semibold">
                        {positions[3]}
                      </span>
                      <p className="p-2 mt-2 rounded-md bg-gray-200">
                        {current.message}
                      </p>
                    </div>
                  </li>
                );
              })}
          </ul>

          {/* Message Input */}
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
              {sendingMessage ? (
                <BiLoaderCircle className="animate-spin text-white" />
              ) : (
                <img src={sendIcon} alt="Send" title="send" className="h-[15px]" />
              )}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default ChatComponent;
