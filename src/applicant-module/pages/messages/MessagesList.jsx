import { useContext, useEffect, useState } from "react";
import { ChatContext } from "../../../context/ChatContext";
import MessageHead from "./MessageHead";

function MessagedList({ chats, selectedChat, setSelectedChat, data }) {
  const {
    loading,
    messages,
    sendMessage,
    getMessages,
    initFirebaseChatSession,
  } = useContext(ChatContext);

  return (
    <div className="h-max w-full md:w-1/4 p-2 border-r">
      <input
        className="w-full border text-sm p-2 focus:outline-none"
        placeholder="Search messages"

      />
      {data && (
        <ul className="min-h-20 w-full flex flex-row md:flex-col py-2 overflow-x-auto overflow-y-hidden md:overflow-y-auto">
          {data?.map((current) => <MessageHead current={current} selectedChat={selectedChat} setSelectedChat={setSelectedChat}/>)
          }
        </ul>
      )}
    </div>
  );
}

export default MessagedList;
