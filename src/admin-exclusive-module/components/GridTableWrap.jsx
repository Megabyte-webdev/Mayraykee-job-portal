import { useState } from "react";
import { BsGrid, BsGridFill } from "react-icons/bs";
import { TbLayoutList, TbLayoutListFilled } from "react-icons/tb";
import TableWrap from "./TableWrap";
import TableRow from "./TableRow";
import GridCard from "./GridCard";
import { useNavigate } from "react-router-dom";
import { exclusives_table_head_dummies } from "../../utils/dummies";

function GridTableWrap() {
  const [isGrid, setIsGrid] = useState(false);
  const navigate = useNavigate();
  const navigateToSingle = (id) => {
        navigate('/admin-exclusives/lists/1');
  }

  return (
    <div className="h-full w-full flex flex-col px-2 md:px-2 mt-5 py-2 gap-[15px]">
      <div className="w-full flex justify-between ">
        <h2 className="font-semibold text-md">All Exclusives: 10</h2>

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
          <TableRow navigateToSingle={navigateToSingle}/>
        </TableWrap>
      ) : (
        <ul className="gap-3 grid grid-cols-3">
          <GridCard navigateToSingle={navigateToSingle}/>
        </ul>
      )}
    </div>
  );
}

export default GridTableWrap;
