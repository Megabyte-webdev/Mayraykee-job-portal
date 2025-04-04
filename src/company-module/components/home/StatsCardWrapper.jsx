import { useContext, useEffect } from "react";
import { stats_cards_dummies } from "../../../utils/dummies";
import StatsCard from "./StatsCard";
import { CompanyRouteContext } from "../../../context/CompanyRouteContext";
import { useNavigate } from "react-router-dom";
import { JobContext } from "../../../context/JobContext";
import { InterviewContext } from "../../../context/InterviewContext";
import { ChatContext } from "../../../context/ChatContext";


function StatsCardWrapper({ applicants }) {
  const { setSideBar } = useContext(CompanyRouteContext);
  const { interviews, getAllInterviews } = useContext(InterviewContext);
  const navigate = useNavigate();
  const { hasNewMessage } = useContext(ChatContext);
  

  return (
    <ul className="flex w-full justify-between h-[50px]">
      {stats_cards_dummies.map( (currentStat) => {
        let value = [];
        let onClick = () => {};
        if (currentStat.id == 1) {
          value = applicants?.filter(item=>item.status === "pending");
          onClick = () => {
            setSideBar(2);
            navigate("/company/applicants");
          };
        } else if (currentStat.id == 2) {
          value = applicants?.filter(item=>item.status === "shortlist");
          onClick = () => {
            setSideBar(5);
            navigate("/company/schedule");
          };
        } else{
          value=Array.from({ length: hasNewMessage }, (_, i) => i + 1); // Convert number to array
          onClick = () => {
            setSideBar(1);
            navigate("/company/messages");
          };
        }
        return (
          <StatsCard
            key={currentStat.id}
            data={currentStat}
            value={value}
            onClick={onClick}
          />
        );
      })}
    </ul>
  );
}

export default StatsCardWrapper;
