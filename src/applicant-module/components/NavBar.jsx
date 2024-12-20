import { MdMenu } from "react-icons/md";
import verifiedIcon from '../../assets/pngs/approved.png'

function NavBar({ state, toogleIsOpen, isOpen }) {
  return (
    <nav className="w-full h-[8%] px-2 lg:px-6 flex items-center justify-between bg-white">
      <MdMenu
            onClick={toogleIsOpen}
            className="text-primarycolor md:hidden text-3xl"
          />
      <h1 className="font-semibold text-[18px] md:text-xl leading-none">{state.title}</h1>

      <div className="flex justify-between items-center gap-3 pr-5">
        <a href="https://mayraykee-app.vercel.app/" className="flex-shrink-0 border px-[5px] py-[3px] text-sm border-primaryColor text-primaryColor">Go to E-Learning</a>
        <img src={verifiedIcon} className="h-[25px]"/>
      </div>
    </nav>
  );
}

export default NavBar;
