import { useState, useEffect, React } from "react";
import { Button, Popover, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Interview = ({ getInterviews, shortListed }) => {
  const navigate=useNavigate();
  const [newInterview, setNewInterview] = useState();
  const [anchorEl, setAnchorEl] = useState(null);

  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  useEffect(() => {
    getInterviews(shortListed?.interview_id, setNewInterview);
  }, []);
  console.log(newInterview);
  const date = new Date(newInterview?.interview_date);
  // Handle navigation to the interview room
  
  const navigateToApplications = (key) => {
    
    navigate("/applicant/applications",{state:{id: `${key}`}});
  setSideBar(3);
};

  return (
    <>
      <Popover
        id="mouse-over-popover"
        sx={{
          pointerEvents: "none",
        }}
        open={open}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        onClose={handlePopoverClose}
        disableRestoreFocus
      >
        <Typography sx={{ p: 1 }}>
          <div className="h-fit flex flex-col gap-2 w-96 p-2 rounded-[15px]">
            <strong className="border-b">Interview Details</strong>
            
            <span >Interviewer: {newInterview?.interviewer_name}</span>
            <span>Date: {(new Date(newInterview?.interview_date)).toLocaleDateString()}</span>
            
            <span>Time: {newInterview?.interview_time}</span>
            {newInterview?.meeting_id && <span>Meeting Id: {newInterview?.meeting_id}</span>}
            {newInterview?.location && <span>Location: {newInterview?.location}</span>}
            <span>Notes: {newInterview?.notes}</span>
            </div>
        </Typography>
      </Popover>
      <div
        aria-owns={open ? "mouse-over-popover" : undefined}
        aria-haspopup="true"
        onMouseEnter={handlePopoverOpen}
        onMouseLeave={handlePopoverClose}
        className="border-b cursor-pointer"
      >
        <div className="px-3 my-3 flex items-center gap-2 flex-wrap">
  {/* Date and Time */}
  <p className="font-medium break-all">
    {date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
  </p>

  {/* Content Wrapper */}
  <div className="bg-[#47AA4933] rounded p-3 min-w-20 flex-grow">
    <div className="flex items-center flex-wrap justify-between gap-3">
      {/* Interviewer and Employer Details */}
      <div className="divide-y-1 divide-inherit">
        <p className="prime_text border-b border-4 font-medium">
          {newInterview?.interviewer_name || "N/A"}
        </p>
        <p className="font-bold">{shortListed?.employer_name || "N/A"}</p>
      </div>

      {/* View Button */}
      <button
        onClick={() => navigateToApplications("shortlist")}
        className="border hover:bg-primaryColor hover:text-white border-primaryColor px-2 text-sm sm:text-little text-primaryColor"
      >
        View
      </button>
    </div>
  </div>
</div>

      </div>
    </>
  );
};

export default Interview;
