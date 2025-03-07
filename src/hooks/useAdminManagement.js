import { useContext, useEffect, useState, useCallback } from "react";
import { axiosClient } from "../services/axios-client";
import { AuthContext } from "../context/AuthContex";
import { get, set } from "idb-keyval";
import axios from "axios";
import { BASE_URL } from "../utils/base";
import { user } from './../utils/dummies';
import MainAxios from "../services/axios-main";
// import AddCurrency from './../admin-module/pages/settings/Currency/AddCurrency';
import { onFailure } from "../utils/notifications/OnFailure";
import { FormatError } from "../utils/formmaters";

const PROFILE_DETAILS_KEY = "Admin Profile Detaials Database";

function UseAdminManagement() {
  const { authDetails } = useContext(AuthContext);
  const client = axiosClient(authDetails?.token);
  const [profileDetails, setProfileDetails] = useState();
  const [loading, setLoading] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const adminProfile = async () => {
    setLoading(true);
    // const { data } = await client.get(
    //   `/domesticStaff/get-staff/${authDetails.user.id}`
    // );
    // await set(PROFILE_DETAILS_KEY, data.data);
    setProfileDetails(authDetails?.user);
    setLoading(false);
  };

  useEffect(() => {
    const initProfileDetails = async () => {
      try {
        // const dataFromDB = await get(PROFILE_DETAILS_KEY);
        // if (dataFromDB) {
        //   setProfileDetails(dataFromDB);
        //   return;
        // }
        adminProfile();
      } catch (error) {
        console.error("Profile Error:", error);
      }
    };
    initProfileDetails();
  }, []);


  const getEmployers = async () => {
    try {
      setLoading(true);
      const response = await client.get(`/getEmployer`);
      return response.data;
    } catch (error) {
      console.error("Error fetching employers:", error);
      return []; // Return an empty array in case of error
    } finally {
      setLoading(false);
    }
  };

  const getEmployerById = async (id) => {
    try {
      setLoading(true);
      const response = await client.get(`/employer/getEmployer/${id}`);
      return response.data;
    } catch (error) {
      return null;
    } finally {
      setLoading(false);
    }
  };


  const getArtisans = async () => {
    setLoading(true);
    try {
      const response = await client.get(`/domesticStaff/staff-type?staff_category=artisan`);
      return response.data.domesticStaff;
    } catch (error) {
      console.error("Error fetching artisans:", error);
      return []; // Return an empty array in case of error
    } finally {
      setLoading(false);
    }
  }


  const getDomesticStaff = async () => {
    try {
      setLoading(true);
      const response = await client.get(`/domesticStaff/staff-type?staff_category=staff`);
      return response.data.domesticStaff;
    } catch (error) {
      console.error("Error fetching domestic staff:", error);
      return [];
    } finally {
      setLoading(false);
    }
  }

  const getStaffById = async (id) => {
    try {
      setLoading(true);
      const response = await client.get(`/domesticStaff/get-staff/${id}`);
      const data = response.data;
      data.data.name = `${data?.data?.first_name} ${data.data.middle_name === null || data.data.middle_name === 'null' ? '' : data.data.middle_name} ${data.data.surname}`;
      return data;
    } catch (error) {
      console.error("Error fetching staff:", error);
      return null;
    } finally {
      setLoading(false);
    }
  }


  const updateStatus = async (data) => {
    try {
      setLoading(true);
      const response = await MainAxios.post("update-status", data);
      return response.data;
    } catch (error) {
      console.error('Error updating status:', error);
      return null;
    } finally {
      setLoading(false);
    }
  };




  const getCandidates = async () => {
    try {
      setLoading(true);
      const response = await client.get(`/candidate/getCandidate`);
      return response.data.candidateAuths;
    } catch (error) {
      console.error("Error fetching employers:", error);
      return []; // Return an empty array in case of error
    } finally {
      setLoading(false);
    }
  };



  const getCandidateById = async (id) => {
    try {
      setLoading(true);
      const response = await client.get(`/candidate/getCandidate/${id}`);
      return response.data.details;
    } catch (error) {
      return null;
    } finally {
      setLoading(false);
    }
  }

  const getJobsByEmployerId = async (id) => {
    try {
      setLoading(true);
      const response = await client.get(`/job-employer-id/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching jobs:", error);
      return [];
    } finally {
      setLoading(false);
    }
  }

  const jobsAppliedToEmployerId = async (id) => {
    try {
      setLoading(true)
      const response = await client.get(`/getEmployerApply/${id}`)
      return response.data.job_application
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
    finally {
      setLoading(false)
    }
  }
  const getEmployerDomesticStaff = async (id) => {
    try {
      setLoading(true);
      const response = await MainAxios.post(`/contracts/details`, {
        user_id: id,
        user_type: 'employer'
      });
      const data = response.data.contracts;

      // Create an array of promises for the getStaffById calls
      const promises = data.map(async (contract) => {
        const staff = await getStaffById(contract.domestic_staff_id);
        contract.staff_name = staff.data.name;
        contract.staff_category = staff.data.staff_category;
        return contract;
      });

      // Wait for all promises to resolve
      const updatedData = await Promise.all(promises);
      return updatedData;
    } catch (error) {
      console.error('Error fetching employer domestic staff:', error);
      return [];
    } finally {
      setLoading(false);
    }
  };


  const getCandidateDomesticStaff = async (id) => {
    try {
      setLoading(true);
      const response = await MainAxios.post(`/contracts/details`, {
        user_id: id,
        user_type: 'candidate'
      });
      const data = response.data.contracts;

      // Create an array of promises for the getStaffById calls
      const promises = data.map(async (contract) => {
        const staff = await getStaffById(contract.domestic_staff_id);
        contract.staff_name = staff.data.name;
        contract.staff_category = staff.data.staff_category;
        return contract;
      });

      // Wait for all promises to resolve
      const updatedData = await Promise.all(promises);
      return updatedData;
    } catch (error) {
      console.error('Error fetching employer domestic staff:', error);
      return [];
    } finally {
      setLoading(false);
    }
  };



  const getStaffReportById = async (reportType, candidateId) => {
    try {
      setLoading(true);
      const response = await client.get(`/domesticStaff/${reportType}/${candidateId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching report:", error);
      return null;
    } finally {
      setLoading(false);
    }
  }



  const getStaffReport = async (reportType) => {
    try {
      setLoading(true);
      const response = await client.get(BASE_URL + "/domesticStaff/" + reportType)
      const data = await response.data;
      return data;
    } catch (error) {
      console.error("Error fetching report:", error);
      return null;
    } finally {
      setLoading(false);
    }
  };


  const getCurrencies = async () => {
    try {
      setLoading(true);
      const response = await client.get("/currencies");
      return response.data;
    } catch (error) {
      console.error("Error fetching currencies:", error);
      return (error);
    } finally {
      setLoading(false);
    }
  }

  const AddFormCurrency = async (currencyData) => {
    try {
      setLoading(true);
      const response = await client.post("/currencies", currencyData);
      return response;
    } catch (error) {
      if (error.status === 500) {
        return error
      }
      console.error("Error adding currency:", error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteCurrencyById = async (id) => {
    try {
      setLoading(true);
      const response = await client.delete(`/currencies/${id}`);
      return response.data;
    }
    catch (error) {
      console.error("Error deleting currency:", error);
      return null;
    } finally {
      setLoading(false);
    }
  }

  const getSectors = async () => {
    try {
      setLoading(true);
      const response = await client.get("/sectors");
      const sectors = response.data.data;
      // Fetch subcategories for each sector
      const sectorsWithSubcategories = await Promise.all(
        sectors.map(async (sector) => {
          //const subResponse = await client.get(`/sub-sectors/${sector.id}`);
          return {
            ...sector,
            subcategories: sector?.sub_sectors,
          };
        })
      );

      return sectorsWithSubcategories;
    } catch (error) {
      console.error("Error fetching sectors:", error);
      return null;
    } finally {
      setLoading(false);
    }
  };


  const createSector = async (sector) => {
    try {
      setLoading(true);
      const response = await client.post("/sectors", sector);
      return response.data;
    } catch (error) {
      console.error("Error creating sector:", error);
      return null;
    } finally {
      setLoading(false);
    }
  };
  const updateSector = async (id, sector) => {
    try {
      setLoading(true);
      const response = await client.post("/sectors", {id: id, ...sector});
      return response.data;
    } catch (error) {
      console.error("Error updating sector:", error);
      return null;
    } finally {
      setLoading(false);
    }
  };
  const updateSubsector = async (id, subsector) => {
    try {
      setLoading(true);
      const response = await client.post("/sub-sectors", {id: id, ...subsector});
      return response.data;
    } catch (error) {
      console.error("Error updating sector:", error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const createSubsector = async (subsector) => {
    try {
      const response = await client.post("/sub-sectors", subsector);
      return response.data;
    } catch (error) {
      console.error("Error creating subsector:", error);
      return null;
    }
  };




  ///////

  const getStaffSectors = async () => {
    try {
      setLoading(true);
      const response = await client.get("/staff-categories");
      const sectors = response.data.data;
      return sectors;
    } catch (error) {
      console.error("Error fetching sectors:", error);
      return null;
    } finally {
      setLoading(false);
    }
  };


  const createStaffSector = async (sector) => {
    try {
      setLoading(true);
      const response = await client.post("/staff-categories/create", sector);
      return response.data;
    } catch (error) {
      console.error("Error creating sector:", error);
      return null;
    } finally {
      setLoading(false);
    }
  };
  const updateStaffSector = async (id, sector) => {
    try {
      setLoading(true);
      const response = await client.post("/staff-categories/create", {id: id, ...sector});
      return response.data;
    } catch (error) {
      console.error("Error updating sector:", error);
      return null;
    } finally {
      setLoading(false);
    }
  };
  const updateStaffSubsector = async (id, subsector) => {
    try {
      setLoading(true);
      const response = await client.post("/staff-categories/subcategory/create", {id: id, ...subsector});
      return response.data;
    } catch (error) {
      console.error("Error updating sector:", error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const createStaffSubsector = async (subsector) => {
    try {
      const response = await client.post("/staff-categories/subcategory/create", subsector);
      return response.data;
    } catch (error) {
      console.error("Error creating subsector:", error);
      const errorDetails = Object.entries(error?.response?.data?.errors || {})
        .map(([key, value]) => `${key}: ${value}`)
        .join("\n") || error?.message;

      onFailure({ message: "Subcategory Creation Failed", error: errorDetails });
      return null;
    }
  };

  const deleteStaffSectorById = async (id) => {
    try {
      setLoading(true);
      const response = await client.delete(`/staff-categories/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting sector:", error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteStaffSubsectorById = async (id) => {
    try {
      setLoading(true);
      const response = await client.delete(`/staff-categories/subcategory/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting subsector:", error);
      return null;
      const errorDetails = Object.entries(error?.response?.data?.errors || {})
        .map(([key, value]) => `${key}: ${value}`)
        .join("\n") || error?.message;

      onFailure({ message: "Error", error: errorDetails });
    } finally {
      setLoading(false);
    }
  }
  ///
  const createSectorWithSubsectors = async (sector, subsectors) => {
    try {
      setLoading(true);
      const createdSector = await createSector(sector);
      if (createdSector && createdSector.data) {
        const sectorId = createdSector.data.id;
        const subSectorPromises = subsectors.map(subsector => {
          return createSubsector({ name: subsector, sector_id: sectorId });
        });
        const createdSubsectors = await Promise.all(subSectorPromises);
        return { sector: createdSector, subsectors: createdSubsectors };
      }
      return null;
    } catch (error) {
      console.error("Error creating sector and subsectors:", error);
      return null;
    } finally {
      setLoading(false);
    }
  };


  const deleteSectorById = async (id) => {
    try {
      setLoading(true);
      const response = await client.delete(`/sectors/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting sector:", error);
       const errorDetails = Object.entries(error?.response?.data?.errors || {})
        .map(([key, value]) => `${key}: ${value}`)
        .join("\n") || error?.message;

      onFailure({ message: "Error", error: errorDetails });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteSubsectorById = async (id) => {
    try {
      setLoading(true);
      const response = await client.delete(`/sub-sectors/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting subsector:", error);
      return null;
      const errorDetails = Object.entries(error?.response?.data?.errors || {})
        .map(([key, value]) => `${key}: ${value}`)
        .join("\n") || error?.message;

      onFailure({ message: "Error", error: errorDetails });
    } finally {
      setLoading(false);
    }
  }

  const adminLogin = async (data) => {
    try {
      setLoading(true);
      const response = await client.post("/admin/login", data);
      return response.data;
    } catch (error) {
      console.error("Error logging in:", error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const AdminLogout = async () => {
    // console.log(authDetails?.token);
    try {
      setLoading(true);
      const response = await client.post('/admin/logout');
      return response.status;
    } catch (error) {
      console.error('Error', error);
      if (error.response && error.response.status === 401) {
        console.error('Unauthorized error:', error.response.data);
      }
      return null;
    } finally {
      setLoading(false);
    }
  };


  const AdminRegistration = async (data) => {
    try {
      setLoading(true)
      const response = await client.post('/admin/register', data)
      return response

    } catch (error) {
      if (error.status === 400) {
        return error
      }
      console.error('Error in registration', error.status)
    }
    finally {
      setLoading(false)
    }
  }

  const AdminChangePwd = async (data) => {
    try {
      setLoading(true)
      const response = await MainAxios.post('/admin/changePassword', data)
      return response
    }
    catch (error) {
      console.error('Error', error)
        return error
    }
    finally {
      setLoading(false)
    }
  }

  const AdminForgotPwd = async (data) => {
    try {
      setLoading(true)
      const response = await client.post('/admin/forgotten-password', data)
      console.log("response", response);
      return response
    }
    catch (error) {
      console.error('Error', error)
      return error
    }
    finally {
      setLoading(false)
    }
  }

  const AdminResetPwd = async (data) => {
    try {
      setLoading(true)
      const response = await client.post('/etPassword', data)
      return response.data
    }
    catch (error) {
      console.error('Error', error.message)
    }
    finally {
      setLoading(false)
    }
  }

  const getAllJobs = async () => {
    try {
      setLoading(true)
      const response = await client.get("/job")
      return response.data
    } catch (error) {
      console.error("error getting jobs", error)
    }
    finally {
      setLoading(false)
    }
  }

  const getJobById = async (id) => {
    try {
      setLoading(true)
      const response = await client.get(`/job/${id}`)
      return response.data
    }
    catch (error) {
      console.log('Error getting job by id', error)
    }
    finally {
      setLoading(false)
    }
  }

  const getSalaries = async () => {
    try {
      setLoading(true)
      const response = await client.get('/salaries')
      return response.data
    }
    catch (err) {
      console.error('Error getting salaries', err)
      return null
    }
    finally {
      setLoading(false)
    }
  }



  const deleteSalaryById = async (id) => {
    try {
      setLoading(true);
      const response = await client.delete(`/salaries/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting sector:", error);
      return null;
    } finally {
      setLoading(false);
    }
  };

const createSalary = async (data) => {
  try {
    setLoading(true)
    const response = await client.post('/salaries', data)
    return response.data
  }
  catch (err) {
    console.error('Error creating salary', err)
    return null
  }
  finally {
    setLoading(false)
  }
}

const getAllAdmins = async () => {
  try {
    setLoading(true)
    const response = await client.get('/admin/getAdmin')
    return response.data.Admins
  }
  catch (err) {
    console.error('Error getting all admins', err)
    return null
  }
  finally {
    setLoading(false)
  }
}

const deleteAdminById = async (id) => {
  try {
    setLoading(true)
    const response = await client.delete(`/admin/deleteAdmin/${id}`)
    return response.data
  }
  catch (err) {
    console.error('Error deleting admin', err)
    return null
  }
  finally {
    setLoading(false)
  }

}

const updateFeaturedJobs = async (job, status) => {
  try {
     // Define fields to exclude
      const excludedFields = ["featured_image"];
  
      // Filter the `post` object to exclude image fields
      const filteredJob = Object.keys(job).reduce((acc, key) => {
        if (!excludedFields.includes(key)) {
          acc[key] = job[key];
        }
        return acc;
      }, {});
    setLoading(true);
    const response = await client.post(`/job`, {
      ...filteredJob,
      feature_jobs: status,
    }, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating jobs", error);
    return null;
  } finally {
    setLoading(false);
  }
};

  const getPackages = async () => {
    setLoading(true);
    try {
      const { data } = await client.get("/packages");
      const userPackage = data.data.sort((a,b) => Number(a.price) - Number(b.price))

      return userPackage;
    } catch (error) {
      return null;
      FormatError(error, setError, "Package Error");
    } finally {
      setLoading(false);
    }
  };

  
  const createPackage = async (pkg) => {
    try {
      setLoading(true);
      const response = await client.post("/packages", pkg);
      return response.data;
    } catch (error) {
      FormatError(error, setError, "Package Creation Error");
      return null;
    } finally {
      setLoading(false);
    }
  };
  const updatePackage = async (id, pkg) => {
    try {
      setLoading(true);
      const response = await client.put(`/packages/${id}`, pkg);
      return response.data;
    } catch (error) {
      FormatError(error, setError, "Package Update Error");
      return null;
    } finally {
      setLoading(false);
    }
  };

  
const deletePackageById = async (id) => {
  try {
    setLoading(true)
    const response = await client.delete(`/packages/${id}`)
    return true
  }
  catch (error) {
    FormatError(error, setError, "Package Removal Error");
    return false
  }
  finally {
    setLoading(false)
  }

}

const getSupport = async () => {
  setLoading(true);
  try {
    const response = await client.get("/contact");
    return response?.data?.data;
  } catch (error) {
    return null;
  } finally {
    setLoading(false);
  }
};

  return {
    loading,
    profileDetails,
    adminProfile,
    getEmployers,
    getArtisans,
    getEmployerById,
    getDomesticStaff,
    getStaffById,
    getCandidates,
    updateStatus,
    getCandidateById,
    getJobsByEmployerId,
    jobsAppliedToEmployerId,
    getEmployerDomesticStaff,
    getCandidateDomesticStaff,
    getStaffReportById,
    getStaffReport,
    AddFormCurrency,
    getSectors,
    createSector,
    updateSector,
    createSubsector,
    updateSubsector,
    getStaffSectors,
    createStaffSector,
    updateStaffSector,
    createStaffSubsector,
    updateStaffSubsector,
    createSectorWithSubsectors,
    deleteSectorById,
    deleteSubsectorById,
    deleteStaffSectorById,
    deleteStaffSubsectorById,
    getCurrencies,
    deleteCurrencyById,
    adminLogin,
    AdminLogout,
    AdminRegistration,
    AdminChangePwd,
    AdminForgotPwd,
    AdminResetPwd,
    getAllJobs,
    getJobById,
    getSalaries,
    deleteSalaryById,
    createSalary,
    getAllAdmins,
    deleteAdminById,
    updateFeaturedJobs,
    getPackages,
    createPackage,
    updatePackage,
    deletePackageById,
    getSupport
  };
}

export default UseAdminManagement;
