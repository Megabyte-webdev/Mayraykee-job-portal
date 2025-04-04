import { createContext, useState } from "react";
import useChats from "../hooks/useChats";

export const ChatContext = createContext();

export const ChatContextProvider = ({ children }) => {
  const {
    loading,
    messages,
    sendMessage,
    hasNewMessage,
    getMessages,
    setMessages,
    initFirebaseChatSession,
    sendingMessage,
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
        hasNewMessage,
        initFirebaseChatSession,
        sendingMessage,
        firebaseMessaging,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
