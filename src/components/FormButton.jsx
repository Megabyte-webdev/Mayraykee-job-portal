import Spinner from "./Spinner";


function FormButton({ children, loading, condition=false, onClick, height = 'h-[45px]', width = 'w-full bg-primaryColor text-white   ' }) {
  return onClick ? (
    <button
      onClick={onClick}
      className={`flex-shrink-0 overflow-hidden text-little ${
        !loading
          ? "hover:text-[13px] hover:scale-105 duration-75"
          : "hover:text-little hover:scale-100 duration-75"
      } relative ${width} ${height} ${condition && "opacity-50"} font-semibold`}
      disabled={condition}
    >
      {children}
      {loading && <Spinner />}
    </button>
  ) : (
    <button
      type="submit"
      className={`flex-shrink-0 overflow-hidden text-small ${
        !loading
          ? "hover:text-[13px] hover:scale-105 duration-75"
          : "hover:text-little hover:scale-100 duration-75"
      } relative ${width} ${height} ${condition && "opacity-50"} font-semibold`}
    disabled={condition}
    >
      {children}
      {loading && <Spinner />}
    </button>
  );
}

export default FormButton;
