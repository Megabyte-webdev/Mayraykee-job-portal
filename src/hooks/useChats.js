import { useContext, useEffect, useState } from "react";
import { axiosClient } from "../services/axios-client";
import { FormatError } from "../utils/formmaters";
import { AuthContext } from "../context/AuthContex";
import { onValue, ref, set } from "firebase/database";
import { database } from "../utils/firebase";

function useChats() {
  const { authDetails } = useContext(AuthContext);
  const client = axiosClient(authDetails?.token, true);
  const [loading, setLoading] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false); // Separate loader for sending messages
  const [details, setDetails] = useState([]);
  const [messages, setMessages] = useState([]);
  const [hasNewMessage, setHasNewMessage] = useState(false); // Track new messages
  
  const [error, setError] = useState({
    message: "",
    error: "",
  });

  const onTextChange = (e) => {
    const { name, value } = e.target;
    setDetails({ ...details, [name]: value });
  };

  const sendMessage = async (message, onSuccess) => {
    setSendingMessage(true);
    try {
      const { data } = await client.post("/messages/send", message);
       // Call onSuccess first to clear the input immediately
    onSuccess();
      
    // Then fetch updated messages
    getMessages(message.receiver_id, () => {});
    } catch (error) {
      FormatError(error);
    } finally {
      setSendingMessage(false);
    }
  };

  const checkUnreadMessages = async () => {
    try {
      const { data } = await client.get(
        `/messages/unread/${authDetails?.user?.id}/${authDetails?.user?.role === "employer" ? "employer" : "candidate"}`
      );
      setHasNewMessage(data.unread_messages_count); // Ensure API returns a boolean
    } catch (error) {

    } 
  };
  
  useEffect(() => {
    if (!authDetails?.user?.id) return;
  
    checkUnreadMessages(); // Initial fetch
  
    const interval = setInterval(() => {
      checkUnreadMessages(); // Polling every 30 seconds
    }, 10000);
  
    return () => clearInterval(interval); // Cleanup on unmount
  }, [authDetails?.user?.id]); // Runs only when user ID changes
  

  const deleteJob = async (handleSuccess, jobId) => {
    setLoading(true);
    try {
      const response = await client.delete(`/job/${jobId}`);
      await getJobsFromDB();
      handleSuccess();
    } catch (error) {
      FormatError(error, setError, "Delete Job");
    } finally {
      setLoading(false);
    }
  };

  const initFirebaseChatSession = (receiverId) => {
    let path;
    let employerId;
    let candidateId;
    if (authDetails.user.role === "employer") {
      path = `employer-${authDetails.user.id}-candidate-${receiverId}`;
      employerId = authDetails.user.id;
      candidateId = receiverId;
    } else {
      path = `employer-${receiverId}-candidate-${authDetails.user.id}`;
      employerId = receiverId;
      candidateId = authDetails.user.id;
    }

    const chatRef = ref(database, `chats/` + path);

    onValue(chatRef, (snapshot) => {
      const data = snapshot.val();
      if (!data) {
        set(chatRef, {
          session_created: new Date(),
          employerId,
          candidateId,
        });
      }
    });
  };

  const firebaseMessaging = (receiverId, message) => {
    let path;
    let employerId;
    let candidateId;
    let messageData = {};
    // console.log(receiverId);
    if (authDetails.user.role === "employer") {
      path = `employer-${authDetails.user.id}-candidate-${receiverId}`;
      employerId = authDetails.user.id;
      candidateId = receiverId;
    } else {
      path = `employer-${receiverId}-candidate-${authDetails.user.id}`;
      employerId = receiverId;
      candidateId = authDetails.user.id;
    }

    const messageRef = ref(database, `messages/` + path);
    set(messageRef, message);
    onValue(messageRef, (snapshot) => {
      const data = snapshot.val();
    });
  };


  const getMessages = async (userId, onSuccess) => {
    
    setLoading(true);
    try {
      let uri;

      if (authDetails.user.role === "employer") {
        uri = `/messages/all/${userId}/candidate/${authDetails.user.id}/${authDetails.user.role}`;
      } else if (authDetails.user.role === "candidate") {
        uri = `/messages/all/${authDetails.user.id}/${authDetails.user.role}/${userId}/employer`;
      }

      const { data } = await client.get(uri);
      setMessages(data.messages);
      onSuccess();
    } catch (error) {
      FormatError(error, setError, "Update Error");
    } finally {
      setLoading(false);
    }
  };



  return {
    loading,
    messages,
    setMessages,
    onTextChange,
    setDetails,
    sendMessage,
    deleteJob,
    getMessages,
    hasNewMessage,
    //Firebase Integrations
    initFirebaseChatSession,
    sendingMessage,
    firebaseMessaging,
  };
}

export default useChats;
