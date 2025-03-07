import { useContext, useState } from "react";
import { BsGrid, BsGridFill } from "react-icons/bs";
import { TbLayoutList, TbLayoutListFilled } from "react-icons/tb";
import TableWrap from "./TableWrap";
import TableRow from "./TableRow";
import GridCard from "./GridCard";
import { useNavigate } from "react-router-dom";
import { exclusives_table_head_dummies } from "../../utils/dummies";
import { AdminExclusiveManagementContext } from "../../context/AdminExclusiveManagement";

function GridTableWrap() {
  const { exclusives } = useContext(AdminExclusiveManagementContext);
  const [isGrid, setIsGrid] = useState(false);
  const navigate = useNavigate();
  const navigateToSingle = (data) => {
    navigate(`/admin-exclusives/lists/${data.id}`, {state: {data}});
  };

  return (
    <div className="h-full w-full flex flex-col px-2 md:px-2 mt-5 py-2 gap-[15px]">
      <div className="w-full flex justify-between ">
        <h2 className="font-semibold text-md">
          Exclusive Subscribers: {exclusives?.length}
        </h2>

        <div className=" px-2">
          <button
            onClick={() => setIsGrid(true)}
            className="bg-gray-200 rounded p-1 mx-1"
          >
            {isGrid ? <BsGridFill className="prime_text" /> : <BsGrid />}
          </button>
          <button
            onClick={() => setIsGrid(false)}
            className="bg-gray-200 rounded p-1 mx-1"
          >
            {isGrid ? (
              <TbLayoutList />
            ) : (
              <TbLayoutListFilled className="prime_text" />
            )}
          </button>
        </div>
      </div>

      {!isGrid ? (
        <TableWrap rows={exclusives_table_head_dummies}>
          {exclusives?.map((current) => (
            <TableRow data={current} key={current} navigateToSingle={navigateToSingle} />
          ))}
        </TableWrap>
      ) : (
        <ul className="gap-3 grid grid-cols-responsive">
          {exclusives?.map((current) => (
            <GridCard data={current} key={current}  navigateToSingle={navigateToSingle} />
          ))}
        </ul>
      )}
    </div>
  );
}

export default GridTableWrap;
