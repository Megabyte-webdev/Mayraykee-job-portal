import { useContext, useEffect, useState } from "react";
import { resourceUrl } from "../../../services/axios-client";
import { ApplicationContext } from "../../../context/ApplicationContext";
import Modal from '../../../components/modal/Modal'
const stages = [
  {
    name: "In-Review",
    stage: "passed",
  },
  {
    name: "Shortlist",
    stage: "passed",
  },
  {
    name: "Interview",
    stage: "current",
  },
  {
    name: "Hired/Declined",
    stage: null,
  },
];

function Resume({ data, applicant }) {
  const [loading, setLoading] = useState(true); // Default loading to true
  const [resume, setResume] = useState();
  const [enLarge, setEnLarge] = useState(false);
  const { getResume } = useContext(ApplicationContext);

  const bgColor = (current) => {
    if (current.stage === "passed") {
      return "bg-primaryColor/80";
    } else if (current.stage === "current") {
      return "bg-primaryColor";
    } else {
      return "bg-gray-300";
    }
  };

  useEffect(() => {
    setLoading(true); // Start loading
    getResume(applicant?.candidate_id, (response) => {
      setResume(response);
      setLoading(false); // Stop loading after fetching
    });
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[200px]">
        <div className="loader"></div> {/* Replace with your spinner */}
        <span className="ml-3 text-primaryColor font-semibold">Loading...</span>
      </div>
    );
  }

  return (
    resume ? (
      <>
        <div className="flex w-full px-2 md:px-5 lg:px-10 mt-[5px]">
          <div className="flex flex-col w-full items-center">
            <h3 className="mb-[10px] tracking-wide flex flex-col items-center text-smd font-semibold">
              {resume.title}
              {resume.resume_path ? (
                <a
                  href={`${resourceUrl}${resume.resume_path}`}
                  target="_blank"
                  className="text-little font-normal hover:underline text-primaryColor"
                >
                  Link to file
                </a>
              ) : (
                <p>No file Uploaded</p>
              )}
            </h3>

            <ul className="flex flex-col text-black gap-[10px] text-sm w-full">
              <li className="flex flex-col gap-[5px] items-center bg-secondaryColor p-2 border-b">
                <span className="font-semibold text-black text-[15px]">
                  Education
                </span>
                <span className="text-black font-semibold flex gap-2 w-full justify-between">
                  Institution
                  <span className="font-normal">
                    {resume.educational_institution}
                  </span>
                </span>
                <span className="text-black font-semibold flex gap-2 w-full justify-between">
                  Academy Name
                  <span className="font-normal">{resume?.academy_name}</span>
                </span>
                <span className="text-black font-semibold flex gap-2 w-full justify-between">
                  Year of Entry{" "}
                  <span className="font-normal">{resume.year_of_entry}</span>
                </span>
                <span className="text-black font-semibold flex gap-2 w-full justify-between">
                  Year of Graduation{" "}
                  <span className="font-normal">
                    {resume.year_of_graduation}
                  </span>
                </span>
              </li>
              <li className="flex flex-col gap-[5px] items-center border-b bg-secondaryColor p-2">
                <span className="font-semibold text-black text-[15px]">
                  Current Work Experience
                </span>
                <span className="text-black font-semibold flex gap-2 w-full justify-between">
                  Company:{" "}
                  <span className="font-normal">{resume.company_name}</span>
                </span>
                <span className="text-black font-semibold flex gap-2 w-full justify-between">
                  Position Held{" "}
                  <span className="font-normal">{resume.position_held}</span>
                </span>
                <span className="text-black font-semibold flex gap-2 w-full justify-between">
                  Date Started{" "}
                  <span className="font-normal">
                    {new Date(resume.start_date).toLocaleDateString()}
                  </span>
                </span>
                <span className="text-black font-semibold flex gap-2 w-full justify-between">
                  Date Ended{" "}
                  <span className="font-normal">
                    {new Date(resume.end_date).toLocaleDateString()}
                  </span>
                </span>
              </li>
            </ul>
          </div>
        </div>
        {applicant?.nin_slip && <div className="flex flex-col justify-between px-10">
          <div onClick={() => setEnLarge(true)} className="cursor-pointer flex flex-col text-little justify-center items-start gap-[2px]">
            <span className="font-semibold ">NIN</span>
            <img
              src={`${resourceUrl}${applicant?.nin_slip}`}
              className="h-[100px] w-[100px] object-contain border border-dotted p-1"
            />
          </div>
        </div>}

        {enLarge && (
          <Modal isOpen={enLarge} closeModal={() => setEnLarge(false)}>
            <div className="flex flex-col justify-center items-center w-full h-full p-4">
              <img
                src={`${resourceUrl}${applicant?.nin_slip}`}
                className="max-w-[80vw] max-h-[80vh] object-contain rounded shadow-lg"
                alt="NIN"
              />
              <a
                href={`${resourceUrl}${applicant?.nin_slip}`}
                download
                target="_blank"
                className="mt-4 inline-block bg-primaryColor text-white px-4 py-2 rounded hover:bg-primaryColor/90 text-sm"
              >
                Download NIN Image
              </a>
            </div>
          </Modal>
        )}

      </>
    ) : (<p className="p-4 font-bold text-gray-600">No resume submitted</p>)
  )
}

export default Resume;
