import { createContext, useState } from "react";
import useChats from "../hooks/useChats";

export const ChatContext = createContext();

export const ChatContextProvider = ({ children }) => {
  const {
    loading,
    messages,
    sendMessage,
    getMessages,
    setMessages,
    initFirebaseChatSession,
    firebaseMessaging,
  } = useChats();
  

  return (
    <ChatContext.Provider
      value={{
        loading,
        messages,
        sendMessage,
        setMessages,
        getMessages,
        initFirebaseChatSession,
        firebaseMessaging,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
