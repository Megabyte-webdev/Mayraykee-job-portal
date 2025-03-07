import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaSpinner, FaPlus } from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UseAdminManagement from "../../../../hooks/useAdminManagement";
import SubscriptionModal from "./SubscriptionModal"; // Modal for Add/Edit
import ConfirmationModal from "./ConfirmationModal"; // Modal for Delete Confirmation
import { FaArrowLeftLong } from "react-icons/fa6";
import { convertDays } from "../../../../utils/constants";

export default function SubscriptionPackages() {
  const [packages, setPackages] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { getPackages, deletePackageById, createPackage, updatePackage } =
    UseAdminManagement();
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [packageToDelete, setPackageToDelete] = useState(null);
  const [packageToDeleteLoading, setPackageToDeleteLoading] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);

  const fetchPackages = async () => {
    setLoading(true);
      const data = await getPackages();
      if(data){
        setPackages(data || []);
        setLoading(false);
      }else{
        setLoading(false);
      }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  const handleAdd = () => {
    setSelectedPackage(null);
    setIsModalOpen(true);
  };

  const handleEdit = (pkg) => {
    setSelectedPackage(pkg);
    setIsModalOpen(true);
  };

  const handleDelete = async () => {
    setPackageToDeleteLoading(packageToDelete?.id);
    try {
      await deletePackageById(packageToDelete.id);
      setPackages((prev) =>
        prev.filter((pkg) => pkg.id !== packageToDelete.id)
      );
      toast.success("Package deleted successfully");
      setIsConfirmModalOpen(false);
    } catch (error) {
      toast.error("Failed to delete package");
    } finally {
      setPackageToDeleteLoading(null);
    }
  };

  const confirmDelete = (pkg) => {
    setPackageToDelete(pkg);
    setIsConfirmModalOpen(true);
  };

  const handleModalSubmit = async (data) => {
    setModalLoading(true);
    
    try {
      if (selectedPackage) {
        const response = await updatePackage(selectedPackage.id, data);
        if (response) {
          toast.success("Package updated successfully");
        }
      } else {
        const packageName = data?.title?.toLowerCase().trim();
    const existingPackage = packages?.find(pkg => pkg?.title?.toLowerCase().trim()?.includes(packageName));
    if (existingPackage) {
      toast.error(`A Package of this type already exist.`);
      setModalLoading(false);
      return;
  }else{
        const response = await createPackage(data);
        if (response) {
          toast.success("Package added successfully");
        }
      }
      }
      setIsModalOpen(false);
      fetchPackages();
    } catch (error) {
      toast.error(
        `Failed to ${selectedPackage ? "update" : "add"} package`
      );
    } finally {
      setModalLoading(false);
    }
  };

  return (
    <div className="p-4">
    <button
        type="button"
        onClick={() => window.history.back()}
        className="flex items-center gap-2 outline outline-offset-5 outline-green-500 px-4 py-2 rounded text-green-500 hover:bg-green-100"
      >
        <FaArrowLeftLong className="me-4 text-green-500" />Back
      </button>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl md:text-2xl font-bold text-green-800">
          Subscription Packages
        </h1>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
        >
          <FaPlus />
          Add Package
        </button>
      </div>
      {loading ? (
        <div className="flex justify-center items-center">
          <FaSpinner className="animate-spin text-3xl" />
        </div>
      ) : (
        <div className="grid grid-cols-responsive gap-6">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className="bg-white shadow-md rounded-md px-4 pb-4 border border-gray-200 relative h-96 overflow-x-auto"
            >
              <div className="sticky top-0 bg-white flex items-center justify-between gap-2 py-4">
              <h2 className="text-xl font-bold text-green-600 mr-auto">{pkg.title}</h2>
              
                <button
                  onClick={() => handleEdit(pkg)}
                  className="flex items-center gap-2 text-blue-600"
                >
                  <FaEdit size="18" />
                </button>
                <button
                  onClick={() => confirmDelete(pkg)}
                  className="flex items-center gap-2 text-red-600"
                  disabled={packageToDeleteLoading === pkg.id}
                >
                  {packageToDeleteLoading === pkg.id ? (
                    <FaSpinner className="animate-spin" />
                  ) : (
                    <FaTrash size="18" />
                  )}
                </button>
              </div>
             <p className="text-gray-600 mt-2">{pkg.description}</p>
              <div className="mt-4">
                <p className="font-medium">Price: ₦{pkg.price}</p>
                <p className="font-medium">Duration: {convertDays(pkg?.duration)}</p>
              </div>
              {pkg?.permissions?.length >0 &&<ul className="mt-4 text-sm text-gray-700 list-disc list-inside capitalize">
                <p className="font-bold mb-2 text-xl text-gray-700">Perks:</p>
                {pkg?.permissions?.map((perk, index) => (
                  <li className="my-1" key={index}>{perk}</li>
                ))}
              </ul>}
            </div>
          ))}
        </div>
      )}
      {isModalOpen && (
        <SubscriptionModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleModalSubmit}
          initialData={selectedPackage}
          loading={modalLoading}
        />
      )}
      {isConfirmModalOpen && (
        <ConfirmationModal
          isOpen={isConfirmModalOpen}
          onClose={() => setIsConfirmModalOpen(false)}
          onConfirm={handleDelete}
          message="Are you sure you want to delete this package?"
          loading={packageToDeleteLoading === packageToDelete?.id}
        />
      )}
    </div>
  );
}
