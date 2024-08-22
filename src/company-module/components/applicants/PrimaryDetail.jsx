import { apiURL, resourceUrl } from "../../../services/axios-client";
import { company_socials } from "../../../utils/constants";
import linkedinIcon from "../../../assets/pngs/linkedin-icon.png";

function PrimaryDetail({ data, applicant }) {
  const getSocials = () => {
    const list = applicant?.social_media_handle.map((current) => {
      if (current.network === "linkedIn") {
        return (
          <a href="" className="w-full flex text-little gap-[5px] items-center">
            <img src={linkedinIcon} className="h-[15px]" />
            {current.url}
          </a>
        );
      }
    }).filter(current => typeof current !== 'undefined');


    
    if (list.length > 0 && list.length) {
      return list;
    } else {
      return <span className="text-little text-gray-400">No socials linked</span>;
    }
  };

  return (
    <div className="w-[30%] border h-full p-2">
      <div className="w-full flex flex-col gap-[15px] items-center">
        <div className="flex w-full gap-[10px] items-center">
          <img
            src={`${resourceUrl}/${applicant?.profile}`}
            className="h-[60px] w-[60px] bg-gray-400 rounded-full"
          />
          <div className="flex flex-col ">
            <h3 className="text-lg font-semibold">{data?.full_name}</h3>
            <span className="text-sm text-gray-400"> {data?.job_title}</span>
          </div>
        </div>

        <div className="w-full h-[100px] flex flex-col gap-[5px] bg-gray-100">
          <div className="w-full flex p-2 border-b border-gray-400 justify-between">
            <span className="text-gray-600 text-little">Applied Job</span>
            <span className="text-gray-400 text-little">
              {new Date(data?.created_at).toLocaleDateString()}
            </span>
          </div>
          <div className="w-full flex flex-col p-2 gap-[5px]  justify-between">
            <span className="text-black font-semibold text-[12px]">
              {data?.job_title}
            </span>
            <span className="text-gray-400 text-little">
              Marketting - Full time
            </span>
          </div>
        </div>

        <div className="w-full h-[30px] flex justify-between px-2 py-1  gap-[5px] bg-gray-100">
          <span className="text-little">Status</span>
          <span className="text-[10px] text-primaryColor uppercase">
            {data?.status}
          </span>
        </div>

        <hr className="h-[1px] bg-gray-400 w-full" />

        <div className="flex flex-col w-full gap-[5px]">
          <span className="font-semibold text-sm">Contact</span>

          <ul className="w-full flex flex-col gap-[10px]">{getSocials()}</ul>
        </div>
      </div>
    </div>
  );
}

export default PrimaryDetail;
