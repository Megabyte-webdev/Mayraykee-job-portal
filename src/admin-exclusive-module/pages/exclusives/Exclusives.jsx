import { useContext, useState } from "react";
import GridTableWrap from "../../components/GridTableWrap";
import AddExclusiveModal from "../../components/modals/AddExclusiveModal";
import { AdminExclusiveManagementContext } from "../../../context/AdminExclusiveManagement";

function Exclusives() {
  const [isOpen, setIsOpen] = useState(false);
  const { exclusives } = useContext(AdminExclusiveManagementContext);

  const toogleExclusiveModal = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Add Exclusive Modal */}
      <AddExclusiveModal isOpen={isOpen} toogleExclusiveModal={toogleExclusiveModal} />

      {/* Main Container */}
      <div className="px-4 md:px-8 py-6 flex flex-col gap-6 bg-gray-50 min-h-screen">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-700">Exclusive Management</h1>
          <button
            onClick={toogleExclusiveModal}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 transition duration-150 rounded-md text-white font-medium shadow-sm"
          >
            Add Exclusive
          </button>
        </div>

        {/* Table Section */}
        <div className="bg-white shadow-lg rounded-lg p-4">
          {exclusives && exclusives.length > 0 ? (
            <GridTableWrap />
          ) : (
            <div className="flex items-center justify-center h-64">
              <p className="text-gray-500 font-medium">No exclusives available.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Exclusives;
