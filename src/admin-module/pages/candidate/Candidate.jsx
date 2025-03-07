import { Helmet } from "react-helmet";
import {
  FaArrowTrendUp,
  FaPlus,
} from "react-icons/fa6";
import { FiUsers } from "react-icons/fi";
import { RiCalendarEventLine } from "react-icons/ri";
import { generateDateRange } from "../../../utils/formmaters";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../context/AuthContex";
import { useNavigate } from "react-router-dom";
import { AdminRouteContext } from "../../../context/AdminRouteContext";
import { BsStopwatch } from "react-icons/bs";
import UseAdminManagement from "../../../hooks/useAdminManagement";
import CandidateUsageChart from './CandidateUsageChart';

function Candidate() {
  const { authDetails } = useContext(AuthContext);
  const { setSideBar } = useContext(AdminRouteContext);
  const { getCandidates } = UseAdminManagement();

  const [candidateCount, setCandidateCount] = useState(0);
  const [pending, setPending] = useState(0);
  const [approved, setapproved] = useState(0);
  const [suspend, setsuspend] = useState(0);
  const [candidates, setCandidates] = useState([]);
const [rejected,setRejected] = useState(0)
  useEffect(() => {
    (async () => {
      const candidates = await getCandidates();
      console.log("candidate" + candidates);
      setCandidates(candidates);
      setCandidateCount(candidates.length);
      const pendingCandidates = candidates.filter(candid => candid.status === 'pending');
      setPending(pendingCandidates.length);
      const approvedCandidates = candidates.filter(candid => candid.status === 'approved');
      setapproved(approvedCandidates.length);
      const suspendCandidates = candidates.filter(candid => candid.status === 'suspend');
      setsuspend(suspendCandidates.length);
      const rejectedCandidates = candidates.filter(candid => candid.status === 'rejected');
      setRejected(rejectedCandidates.length);
    })();
  }, []);

  const navigate = useNavigate();
  const navigateToPage = (route, index) => {
    navigate(route);
    setSideBar(index);
  };

  return (
    <>
      <Helmet>
        <title>Admin| Dashboard</title>
      </Helmet>
      <div className="h-full py-6 w-full text-sm text-gray-800">
        <div className="text-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 p-4">
            <div className="bg-orange-400 text-white px-4 py-12 rounded-md flex flex-col items-start cursor-pointer" onClick={() => navigate('/admin/candidates/all')}>
              <h3 className="text-xl font-bold">{candidateCount}</h3>
              <p>All Registered Candidates</p>
            </div>
            <div className="bg-yellow-500 text-white px-4 py-12 rounded-md flex flex-col items-start">
              <h3 className="text-xl font-bold">{pending}</h3>
              <p>Pending</p>
            </div>
            <div className="bg-green-500 text-white px-4 py-12 rounded-md flex flex-col items-start">
              <h3 className="text-xl font-bold">{approved}</h3>
              <p>Approved</p>
            </div>
            <div className="bg-blue-700 text-white px-4 py-12 rounded-md flex flex-col items-start">
              <h3 className="text-xl font-bold">{suspend}</h3>
              <p>Suspended</p>
            </div>
            <div className="bg-red-700 text-white px-4 py-12 rounded-md flex flex-col items-start">
              <h3 className="text-xl font-bold">{rejected}</h3>
              <p>Rejected</p>
            </div>
            {/* <div className="bg-cyan-950 text-white px-4 py-12 rounded-md flex flex-col items-start">
              <h3 className="text-xl font-bold">{candidateCount}</h3>
              <p>Total Jobs Applied</p>
            </div> */}
          </div>
          <div className="mt-8">
            <CandidateUsageChart candidates={candidates} />
          </div>
        </div>
      </div>
    </>
  );
}

export default Candidate;
