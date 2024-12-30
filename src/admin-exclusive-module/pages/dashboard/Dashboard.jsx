import { useContext } from "react";
import { admin_exlusve_dummies } from "../../../utils/dummies";
import GridTableWrap from "../../components/GridTableWrap";
import SummaryCard from "../../components/SummaryCard";
import { AdminExclusiveManagementContext } from "../../../context/AdminExclusiveManagement";

function Dashboard() {
  const { dashboardSummary, exclusives } = useContext(
    AdminExclusiveManagementContext
  );

  console.log("Exclusives:", exclusives);

  // window.location.reload();

  return (
    <div className="px-12 py-5 flex flex-col gap-3">
      <div className="bg-primaryColor text-white gap-3 flex flex-col p-3">
        <p className="font-semibold">Manage all exclusive employers here</p>
        <p>
          You can add new employers, update the status of existing ones and
          manage all thier businesses
        </p>
      </div>

      <ul className="w-full grid grid-cols-responsive3 lg:grid-cols-3 gap-4 mt-8">
        {admin_exlusve_dummies.map((current) => {
          const value =
            current.id === 1
              ? exclusives?.length
              : current === 2
              ? dashboardSummary?.total_applicants
              : dashboardSummary?.total_jobs;
          return <SummaryCard key={current.id} {...current} value={value} />;
        })}
      </ul>

      {/*  */}
      <GridTableWrap />
    </div>
  );
}

export default Dashboard;
