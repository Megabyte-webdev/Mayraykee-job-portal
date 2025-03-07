import { MeetingProvider, useMeeting } from "@videosdk.live/react-sdk";
import CompanyView from "./CompanyView";
import Participant from "./Participant";
import You from "./You";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContex";
import { getAuthToken, createMeeting } from "./Api";
import { onSuccess } from "../../utils/notifications/OnSuccess";
import { useLocation, useNavigate } from "react-router-dom";
import Meeting from "./Meeting";
import { ApplicationContext } from "../../context/ApplicationContext";

function InterviewRoom() {
  const { state } = useLocation();
  const navigate= useNavigate();
  const [meetingId, setMeetingId] = useState(state?.interview?.meeting_id);
  const { authDetails } = useContext(AuthContext);
  const {application } = useContext(ApplicationContext);
 
  console.log("auth token", getAuthToken);
  console.log("meeting id", meetingId);
  const exclusive= state?.exclusive;
  const auth= exclusive?.user ? exclusive : authDetails;
  const onClick = async () => {
    const roomId = await createMeeting("");
    setMeetingId(roomId);
  };
if(application?.status !== "shortlist"){
  navigate(-1);
}

  return (
    <main className="h-screen flex items-center justify-center w-screen">
      <div className="w-[95%] flex flex-col items-center justify-between rounded-[15px] h-[95%] bg-white/50">
        {meetingId && (
          <MeetingProvider
            config={{
              meetingId,
              micEnabled: true,
              webcamEnabled: true,
              name: auth?.user?.name || "You",
              participantId: auth?.user?.role,
              mode: "CONFERENCE",
            }}
            token={getAuthToken()}
          >
            <Meeting interview={state?.interview} exclusive={state?.exclusive} />
          </MeetingProvider>
        )}
      </div>
    </main>
  );
}

export default InterviewRoom;
