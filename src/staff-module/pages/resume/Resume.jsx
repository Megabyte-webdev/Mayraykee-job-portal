import { useContext, useEffect, useRef, useState } from "react";
import { StaffManagementContext } from "../../../context/StaffManagementModule";
import FormButton from "../../../components/FormButton";
import { onSuccess } from "../../../utils/notifications/OnSuccess";
import { onFailure } from "../../../utils/notifications/OnFailure";
import { AuthContext } from "../../../context/AuthContex";
import { axiosClient, resourceUrl } from "../../../services/axios-client";
import { FiUploadCloud, FiFileText, FiX, FiDownload, FiEye } from "react-icons/fi";

const Resume = () => {
  const { authDetails } = useContext(AuthContext);
  const { profileDetails, getStaffProfile } = useContext(StaffManagementContext);
  const client = axiosClient(authDetails?.token, true);

  const [resumeUrl, setResumeUrl] = useState(""); // Resume from server
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [activeTab, setActiveTab] = useState("Upload Resume");
  const fileInputRef = useRef(null);

  useEffect(() => {
    console.log(profileDetails)
    if (profileDetails?.resume) {
      const filePath = `${resourceUrl}${profileDetails.resume}`;
      setResumeUrl(filePath);
      setActiveTab("View Resume"); // Default to view mode if file exists
    }
  }, [profileDetails]);

  // Handle File Selection (Click or Drag)
  const handleFileSelect = (file) => {
    if (!file) return;
    if (!["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "image/jpeg", "image/png"].includes(file.type)) {
      onFailure({ message: "Invalid File", error: "Only PDF, DOC, DOCX, JPG, PNG are allowed" });
      return;
    }
    if (file.size > 1024*1024) { // 1MB Limit
      onFailure({ message: "File Too Large", error: "File must be under 1MB" });
      return;
    }
    setSelectedFile(file);
  };

  // Handle File Drop
  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    handleFileSelect(file);
  };

  // Handle File Upload
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      onFailure({ message: "Upload Failed", error: "Please select a file" });
      return;
    }

    if (resumeUrl) {
      onFailure({ message: "Upload Blocked", error: "Resume already uploaded, you can upload a new one." });
      return;
    }

    const formData = new FormData();
    formData.append("resume", selectedFile);

    setLoading(true);
    try {
      await client.post(`/domesticStaff/update-profile/${authDetails.user.id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      await getStaffProfile();
      onSuccess({ message: "Upload Success", success: "Resume updated successfully" });

      setActiveTab("View Resume");
      setSelectedFile(null); // Clear file after upload
    } catch (error) {
      onFailure({ message: "Upload Error", error: "Resume update failed" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-fit w-full py-5 px-2 md:px-12 flex flex-col gap-4">
      {/* Tab Navigation */}
      <div className="w-full h-[45px] border-b flex gap-3">
        {["Upload Resume", "View Resume"].map((tab) => (
          <button
            key={tab}
            className={`h-full px-4 ${
              activeTab === tab ? "border-b-2 border-primaryColor text-primaryColor" : "text-gray-400"
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Upload Resume */}
      {activeTab === "Upload Resume" && (
        <form onSubmit={handleUpload} className="flex flex-col gap-4 items-center border p-5 rounded-lg">
          {/* Drag & Drop Area */}
          <div
            className="w-full h-40 border-2 border-dashed rounded-lg flex flex-col items-center justify-center bg-gray-200 hover:bg-gray-300 transition-all cursor-pointer"
            onClick={() => fileInputRef.current.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
          >
            <FiUploadCloud className="w-10 h-10 text-gray-600" />
            <span className="text-gray-600">Click to Upload or Drag & Drop</span>
          </div>

          {/* Hidden File Input */}
          <input type="file" accept=".pdf,.doc,.docx,.jpg,.png" ref={fileInputRef} className="hidden" onChange={(e) => handleFileSelect(e.target.files[0])} />

          {/* Selected File Name */}
          {selectedFile && (
            <div className="flex items-center gap-2 bg-gray-200 px-4 py-2 rounded-md">
              <FiFileText className="w-5 h-5 text-gray-600" />
              <span className="text-gray-700">{selectedFile.name}</span>
              <FiX className="w-5 h-5 text-red-500 cursor-pointer" onClick={() => setSelectedFile(null)} />
            </div>
          )}

          <span className="text-sm text-gray-500">Allowed: PDF, DOC, DOCX, JPG, PNG (max 1MB).</span>
          <FormButton loading={loading} type="submit" width="w-[30%] bg-primaryColor text-white">
            Upload Resume
          </FormButton>
        </form>
      )}

      {/* View Resume */}
      {activeTab === "View Resume" && (
        <div className="flex flex-col items-center gap-3">
          {resumeUrl ? (
            <div className="flex flex-col items-center gap-3 w-full">
              {/* Image Preview */}
              {resumeUrl.match(/\.(jpeg|jpg|png)$/) ? (
                <img src={resumeUrl} alt="Resume Preview" className="w-full max-w-[400px] rounded-md border shadow-md" />
              ) : resumeUrl.endsWith(".pdf") ? (
                // PDF Preview
                <iframe src={resumeUrl} className="w-full h-96 border" title="Resume Preview"></iframe>
              ) : (
                // Other File Types
                <div className="flex flex-col items-center gap-2">
                  <FiFileText className="w-10 h-10 text-gray-600" />
                  <span className="text-gray-600">Resume Uploaded</span>
                </div>
              )}

              {/* Download and View Button */}
              <div className="flex gap-4">
                <a href={resumeUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition-all">
                  <FiEye className="w-5 h-5" /> View File
                </a>
                <a href={resumeUrl} download className="flex items-center gap-2 px-4 py-2 bg-primaryColor text-white rounded-md hover:bg-green-800 transition-all">
                  <FiDownload className="w-5 h-5" /> Download
                </a>
              </div>
            </div>
          ) : (
            <p className="text-gray-500">No resume uploaded yet.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Resume;
