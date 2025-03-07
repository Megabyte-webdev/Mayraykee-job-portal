import { useContext } from "react";
import { admin_exlusve_dummies } from "../../../utils/dummies";
import GridTableWrap from "../../components/GridTableWrap";
import SummaryCard from "../../components/SummaryCard";
import { AdminExclusiveManagementContext } from "../../../context/AdminExclusiveManagement";

function Dashboard() {
  const { dashboardSummary, exclusives } = useContext(AdminExclusiveManagementContext);

  console.log("Exclusives:", exclusives);

  return (
    <div className="px-3 md:px-8 py-5 flex flex-col gap-3">
      <div className="bg-primaryColor text-white gap-3 flex flex-col p-3">
        <p className="font-semibold">Manage Exclusive Package Subscribers</p>
        <p>
          You can add new employers, update the status of existing ones and
          manage all their businesses.
        </p>
      </div>

      <ul className="w-full grid grid-cols-responsive3 lg:grid-cols-3 gap-4 mt-8">
        {admin_exlusve_dummies.map((current) => {
          let value;
          if (current.id === 1) {
            value = exclusives?.length || 0; // Fallback to 0 if exclusives is undefined
          } else if (current.id === 2) {
            value = dashboardSummary?.total_applicants || 0; // Fallback to 0 if total_applicants is undefined
          } else if (current.id === 3) {
            value = dashboardSummary?.total_jobs || 0; // Fallback to 0 if total_jobs is undefined
          }

          return <SummaryCard key={current.id} {...current} value={value} />;
        })}
      </ul>

      {/*  Add your grid table component here */}
      <GridTableWrap />
    </div>
  );
}

export default Dashboard;
