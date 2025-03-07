import { useContext, useEffect, useState } from "react";
import { axiosClient } from "../services/axios-client";
import { set, get, del, keys, clear } from "idb-keyval";
import { FormatError } from "../utils/formmaters";
import { AuthContext } from "../context/AuthContex";
import { SubscriptionContext } from "../context/SubscriptionContext";
import { onFailure } from "../utils/notifications/OnFailure";
import axios from 'axios';

export const JOB_MANAGEMENT_Key = "Job Management Database";
export const apiURL = "https://dash.mayrahkeeafrica.com/api";

function useJobManagement() {
  const subUtils = useContext(SubscriptionContext);
  const activePackage=subUtils?.activePackage;
  const currentPackage = activePackage
  ? subUtils?.packages?.find((pkg) => pkg.id === activePackage.package_id)
  : {};

  const { authDetails } = useContext(AuthContext);
  const client = axiosClient(authDetails?.token, true);
  const [loading, setLoading] = useState(false);
  const [details, setDetails] = useState({
    featured_image: null,
    job_title: "",
    job_description: "",
    sector: "",
    type: "",
    search_keywords: "",
    job_apply_type: "",
    external_url: "",
    gender: "",
    email: "",
    salary_type: "",
    min_salary: 0,
    max_salary: 10000,
    experience: "",
    career_level: "",
    currency: "",
    preferred_age: null,
    qualification: [],
    introduction_video_url: "",
    application_deadline_date: "",
    office_address: "",
    location: "",
    maps_location: "",
    number_of_participants: currentPackage?.number_of_candidates || 0,
  });
  const [jobList, setJobList] = useState([]);
  const [applicantJobs, setApplicantJobs] = useState([]);
  const [error, setError] = useState({
    message: "",
    error: "",
  });

  const onTextChange = (e) => {
    const { name, value } = e.target;
    setDetails({ ...details, [name]: value });
  };

  const getEmployentTypes = async () => {
    try {
      const response = await client.get(`/employment-types`);
      return response.data;
    } catch (error) {
      FormatError(error, setError, "Employment types Error");
      return [];
    } finally {
      setLoading(false);
    }
  };

  const getCurrencies = async () => {
    try {
      const response = await client.get(`/currencies`);
      return response.data;
    } catch (error) {
      FormatError(error, setError, "Currency Error");
      return [];
    } finally {
      setLoading(false);
    }
  };

  const getSectors = async () => {
    try {
      const response = await client.get(`/sectors`);
      return response.data.data;
    } catch (error) {
      FormatError(error, setError, "Sector Error");
      return [];
    } finally {
      setLoading(false);
    }
  };

  const getSubSectors = async (sectorid) => {
    try {
      const response = await client.get(`/sub-sectors/${sectorid}`);
      return response.data.data;
    } catch (error) {
      FormatError(error, setError, "Subsector Error");
      return [];
    } finally {
      setLoading(false);
    }
  };

  const validateJobDetails = (currentStep) => {
    const fieldNames = {
      job_title: "Job Title",
      job_description: "Job Responsibilities",
      featured_image: "Featured Image",
      gender: "Gender",
      sector: "Job Sector",
      subsector: "Job Subsector",
      type: "Type of Employment",
      search_keywords: "Search Keywords",
      email: "Contact Email",
      salary_type: "Salary Type",
      min_salary: "Minimum Salary",
      max_salary: "Maximum Salary",
      experience: "Qualification Requirements",
      qualification: "Required Qualifications or Degrees",
      currency: "Currency",
      career_level: "Career Level",
      application_deadline_date: "Application Deadline Date",
      office_address: "Office Address",
      location: "Location",
      preferred_age: "Preferred Age Limit",
    };

    const stage1Fields = [
      "sector",
      "featured_image",
      "type",
      "gender",
      "salary_type",
      "currency",
      "location",
      "search_keywords",
      "qualification",
      "email",
      "min_salary",
      "max_salary",
      "application_deadline_date",
      "office_address",
      "preferred_age",
    ];

    const stage2Fields = ["job_title", "job_description", "experience","career_level"];

    let fieldsToValidate = [];

    if (currentStep.id === 1) {
      fieldsToValidate = stage1Fields;
    } else if (currentStep.id === 2) {
      fieldsToValidate = [...stage1Fields, ...stage2Fields];
    }

    for (const key of fieldsToValidate) {
      if (
        !details[key] ||
        (Array.isArray(details[key]) && details[key].length === 0)
      ) {
        return `${fieldNames[key]} is required.`;
      }
    }

    if (Number(details?.preferred_age) < 18) {
      return "The preferred age field must be at least 18.";
    }

    if (Number(details.min_salary) > Number(details.max_salary)) {
      return "Minimum Salary cannot be greater than Maximum Salary.";
    }

    return null; // Validation passed
  };

  const addJob = async (handleSuccess) => {
    setLoading(true);
    try {
      const validationError = validateJobDetails({ id: 2 });
      
      if (validationError) {
        throw new Error(validationError);
      }
      if (currentPackage?.number_of_jobs <= jobList?.length) {
        throw new Error(
          `Job limit reached. Your package allows posting up to ${currentPackage?.number_of_jobs} jobs.`
        );
      }
      const formDetails={
        employer_id: authDetails?.user.id,
        ...details,
      }
       // Create a new FormData object
       const formData = new FormData();
        // Loop over the details object to append each key-value pair to FormData
       // Loop over the details object to append each key-value pair to FormData
       for (const key in formDetails) {
        if (formDetails.hasOwnProperty(key)) {
           //If the field is 'qualification' and it's an array, handle it separately
           if (key === "qualification" && Array.isArray(formDetails[key])) {
             formDetails[key].forEach((qual) => {
               formData.append("qualification[]", qual); // Append each qualification as a separate field
             });
           } else {
             // For other fields, append normally
             formData.append(key, formDetails[key]);
           }
         }
       }
      const response = await client.post(`/job`, formData );

      setDetails({});
      await getJobsFromDB();
      handleSuccess();
    } catch (error) {
      const errorDetails = Object.entries(error?.response?.data?.errors || {})
        .map(([key, value]) => `${key}: ${value}`)
        .join("\n") || error?.message;

      onFailure({ message: "Submission Failed", error: errorDetails });
    } finally {
      setLoading(false);
    }
  };

  const editCurrentJob = async (handleSuccess) => {
    setLoading(true);
    try {
      const validationError = validateJobDetails({ id: 2 });
      if (validationError) {
        throw new Error(validationError);
      }
  
      // Create a new FormData object
      const formData = new FormData();
  
      for (const key in details) {
        if (details.hasOwnProperty(key)) {
          // Handle the 'featured_image' field separately
          if (key === "featured_image") {
            // Check if 'featured_image' is a new file (Blob or File instance)
            if (details.featured_image instanceof Blob || details.featured_image instanceof File) {
              formData.append("featured_image", details.featured_image);
            }
          } else if (key === "qualification" && Array.isArray(details[key])) {
            // If the field is 'qualification' and it's an array, handle it separately
            details[key].forEach((qual) => {
              formData.append("qualification[]", qual); // Append each qualification as a separate field
            });
          } else {
            // For other fields, append normally
            formData.append(key, details[key]);
          }
        }
      }
      
  
      // // Append the image if it exists (assuming it's in details.image)
      // if (details.image) {
      //   formData.append('image', details.image); // Adjust based on your actual field name
      // }
  
      const response = await client.post(`${apiURL}/job`, formData);
  
      setDetails({});
      await getJobsFromDB();
      handleSuccess();
    } catch (error) {
      onFailure({ message: "Submission Failed", error: error?.response?.data?.message || error?.message });
    } finally {
      setLoading(false);
    }
  };
  

  const addJobForExclusive = async (handleSuccess, id) => {
    setLoading(true);
    try {
      const validationError = validateJobDetails({ id: 2 });
      if (validationError) {
        throw new Error(validationError);
      }

      const response = await client.post(`/job`, {
        employer_id: id,
        ...details,
      });

      setDetails({});
      await getJobsFromDB();
      handleSuccess();
      
    } catch (error) {
      onFailure({ message: "Submission Failed", error: error.message });
    } finally {
      setLoading(false);
    }
  };

  const deactivateJob = async (data) => {
    setLoading(true);
    try {
      const response = await client.post("update-status", data);
      await getJobsFromDB();
    } catch (error) {
      FormatError(error, setError, "Status Error");
    } finally {
      setLoading(false);
    }
  };
  

  const deleteJob = async (handleSuccess, jobId) => {
    setLoading(true);
    try {
      const response = await client.delete(`/job/${jobId}`);
      await getJobsFromDB();
      handleSuccess();
    } catch (error) {
      FormatError(error, setError, "Delete Job");
    } finally {
      setLoading(false);
    }
  };

  const getJobsFromDB = async () => {
    if (authDetails?.token) {
      setLoading(true);
      try {
        const response = await client.get("/job");
        setJobList(response.data?.filter(one => Number(one.employer_id) === Number(authDetails?.user?.id)));
        await set(JOB_MANAGEMENT_Key, response.data?.filter(one => Number(one.employer_id) === Number(authDetails.user?.id)));
      } catch (error) {
        FormatError(error, setError);
      } finally {
        setLoading(false);
      }
    }
  };

  const getJobById = async (jobId, setJob) => {
    setLoading(true);
    const job = jobList.find((current) => current.id === Number(jobId));
    if (job) {
      setJob(job);
      return;
    }
    try {
      const { data } = await client.get(`/job/${jobId}`);
      setJob({ ...data });
    } catch (error) {
      FormatError(error);
    } finally {
      setLoading(false);
    }
  };

  const getJobsByApplicant = async () => {
    setLoading(true);
    try {
      const { data } = await client.get(`/getUserApply/${authDetails.user.id}`);
      setApplicantJobs(data.job_application);
    } catch (error) {
      FormatError(error, setError, "Jobs Error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authDetails?.token && error.message && error.error) {
      onFailure(error);
    }
  }, [error.message, error.error]);

  useEffect(() => {
    const initValue = async () => {
      try {
        const storedValue = await get(JOB_MANAGEMENT_Key);
        if (storedValue !== undefined && storedValue.length > 0) {
          setJobList(storedValue);
        } else {
          await getJobsFromDB();
        }
      } catch (error) {
        FormatError(error, setError, "Index Error");
      }
    };

    if (authDetails?.token !== null || authDetails?.token !== undefined) {
      initValue();
    }
  }, [authDetails?.token]);

  return {
    loading,
    details,
    jobList,
    applicantJobs,
    onTextChange,
    setDetails,
    addJob,
    editCurrentJob,
    deleteJob,
    deactivateJob,
    getJobById,
    getJobsByApplicant,
    getEmployentTypes,
    getCurrencies,
    getSectors,
    getSubSectors,
    validateJobDetails,
    addJobForExclusive
  };
}

export default useJobManagement;
