import React, { useState } from "react";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { FaPencil } from "react-icons/fa6";
import UseAdminManagement from "../../../hooks/useAdminManagement";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";

const GuarantorReportDialog = ({ fetchData }) => {
  const [visible, setVisible] = useState(false);
  const [updateDialogVisible, setUpdateDialogVisible] = useState(false);
  const [guarantors, setGuarantors] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [status, setStatus] = useState("");
  const { updateStatus } = UseAdminManagement();
  const [isLoading, setIsLoading] = useState(false);

  const handleOpen = async () => {
    setVisible(true);
    setIsLoading(true);
    setGuarantors([]);
    setTimeout(async () => {
      const data = await fetchData();
      setGuarantors(data.guarantor);
      setIsLoading(false);
    }, 2000); // Simulate loading for 2 seconds
  };

  const handleUpdateOpen = (report) => {
    setSelectedReport(report);
    setStatus(report.status || "");
    setUpdateDialogVisible(true);
  };

  const handleUpdateStatus = async () => {
    console.log("Selected status:", status);
    console.log("Report Id:", selectedReport.domestic_staff_id);

    if (!status) {
      console.error('selectedData is null or undefined');
      toast.error('An error occurred. Please try again');
      return;
    }

    const formData = {
      id: selectedReport.domestic_staff_id,
      status: status,
      type: 'guarantor'
    };

    console.log("Form data being sent:", formData);

    try {
      const res = await updateStatus(formData);
      if (res) {
        setUpdateDialogVisible(false);
        toast.success('Status updated successfully');
        // Fetch the updated details
        const data = await fetchData();
        setGuarantors(data.guarantor);
      } else {
        toast.error('An error occurred while updating status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      if (error.response && error.response.data) {
        console.error('Server response:', error.response.data);
      }
      toast.error('An error occurred while updating status');
    }
  };

  const statusOptions = [
    { label: 'Pending', value: 'pending' },
    { label: 'Approved', value: 'approved' },
    { label: 'Rejected', value: 'rejected' },
    { label: 'Suspend', value: 'suspend' },
  ];

  return (
    <div className="card flex flex-col space-y-4">
      <div className="bg-green-500 px-20 py-20 rounded-lg text-white  hover:cursor-pointer" onClick={handleOpen}>
      View Guarantor Report
      {isLoading && <ClipLoader size={20} color={"#ffffff"} loading={isLoading} className="ml-2" />}
      </div>
      <Dialog header="Guarantor Report" visible={visible} style={{ width: '90vw', maxWidth: '600px',  overflowY:"auto", height:"max-content", maxHeight:"90%" }} onHide={() => setVisible(false)} modal>
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <ClipLoader size={50} color={"#000"} loading={isLoading} />
          </div>
        ) : (
          guarantors.length > 0 ? guarantors.map((guarantor) => (
            <div key={guarantor?.id} className="p-3 border-b-2 border-gray-200 space-y-5">
              <p><strong>Title:</strong> {guarantor?.title}</p>
              <p><strong>Surname:</strong> {guarantor?.surname}</p>
              <p><strong>First Name:</strong> {guarantor?.first_name}</p>
              <p><strong>Date of Birth:</strong> {(guarantor?.dob?.match(/(\d{4})-(\d{1,2})-(\d{1,2})/) || [])?.slice(1).reverse().join("-")}</p>
              <p><strong>Religion:</strong> {guarantor?.religion}</p>
              <p><strong>Residential Address:</strong> {guarantor?.residential_address}</p>
              <p><strong>Near Bus Stop:</strong> {guarantor?.near_bus_stop}</p>
              <p><strong>Close Landmark:</strong> {guarantor?.close_landmark}</p>
              <p><strong>Mobile Phone:</strong> {guarantor?.mobile_phone}</p>
              <p><strong>Email:</strong> {guarantor?.email}</p>
              <p><strong>Occupation:</strong> {guarantor?.occupation}</p>
              <p><strong>Status:</strong> {guarantor?.status}</p>
              <button
                type="button"
                className="flex items-center gap-2 bg-green-500 px-4 py-2 rounded"
                onClick={() => handleUpdateOpen(guarantor)}
              >
                <FaPencil className="ml-2 text-lg text-white" />
              </button>
            </div>
          )) : <p>No guarantor report available</p>
        )}
      </Dialog>
      <Dialog header="Update Status" visible={updateDialogVisible} style={{ width: '90vw', maxWidth: '600px' }} onHide={() => setUpdateDialogVisible(false)} modal>
        <div className="p-4">
          <h3>Update Status</h3>
          <Dropdown value={status} options={statusOptions} onChange={(e) => setStatus(e.value)} placeholder="Select a Status" className="w-full mb-4" />
          <button
            type="button"
            className="flex items-center gap-2 bg-green-500 px-4 py-2 rounded text-white"
            onClick={handleUpdateStatus}
          >
            Update
          </button>
        </div>
      </Dialog>
    </div>
  );
};

export default GuarantorReportDialog;