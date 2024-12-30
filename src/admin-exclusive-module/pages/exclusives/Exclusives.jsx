import { useContext, useState } from "react";
import GridTableWrap from "../../components/GridTableWrap";
import AddExclusiveModal from "../../components/modals/AddExclusiveModal";
import { AdminExclusiveManagementContext } from "../../../context/AdminExclusiveManagement";

function Exclusives() {
  const [isOpen, setIsOpen] = useState(false);
  const {exclusives} = useContext(AdminExclusiveManagementContext)

  const toogleExclusiveModal = () => setIsOpen(!isOpen)

  return (
    <>
    <AddExclusiveModal isOpen={isOpen} toogleExclusiveModal={toogleExclusiveModal}/>
    <div className="px-12 py-5 flex flex-col gap-3">
      <button
        onClick={toogleExclusiveModal}
        className="ml-4 px-2 py-1 bg-primaryColor w-fit font-semibold hover:scale-[102%] duration-75 rounded-md text-white"
      >
        Add Exclusive
      </button>

      <GridTableWrap />
    </div>
    </>
  );
}

export default Exclusives;
