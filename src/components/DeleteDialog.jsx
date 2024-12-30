import { MdClose } from "react-icons/md";
import FormButton from "./FormButton";
function DeleteDialog({ title, isOpen, setIsOpen, handleDelete, loading }) {
  return (
    isOpen && (
      <div className="fixed bg-gray-600/30 w-full h-full left-0 top-0 flex items-center justify-center">
        <div className="w-60 flex flex-col p-2 bg-white justify-between rounded-[10px] min-h-10">
          <div className="w-full flex text-red-600 justify-between items-center">
            <span className="text-sm  font-semibold">Delete item</span>
            <MdClose  onClick={() => setIsOpen(false)}className="h-[30px] place-self-end cursor-pointer" />
          </div>
          <hr className="w-full" />

          <div className="h-[65%] text-sm flex gap-[10px] flex-col w-full ">
            <span>Are you sure you want to delete this item?</span>
            <div className="flex justify-end items-center gap-[10px] w-full">
              <div className="flex">
                <FormButton loading={loading} onClick={handleDelete}  height="h-[30px]" width="w-[50px]">
                  Yes
                </FormButton>
              </div>
              <button onClick={() => setIsOpen(false)} className="h-[30px] w-[50px] hover:scale-105 duration-75 border rounded-[5px]">
                No
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  );
}

export default DeleteDialog;
