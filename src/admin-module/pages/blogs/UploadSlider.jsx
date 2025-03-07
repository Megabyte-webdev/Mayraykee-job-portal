import React, { useState } from "react";
const UploadSlider = ({ handleImageChange, image }) => {
  const [upload, setUpload] = useState(""); // Temporary state to hold uploaded image preview


  const handleAttach = () => {
    if (upload) {
      setImage(upload); // Pass the uploaded image to the parent component
      setUpload(""); // Clear temporary upload state
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 px-2">
        Upload Slider
      </label>
      <small class="px-2 mb-2 text-sm text-gray-400 font-medium">File size should not exceed 1MB. </small>
      <div className="flex items-center gap-4">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="block w-full text-sm text-gray-600
            file:mr-4 file:py-2 file:px-4
            file:rounded file:border-0
            file:text-sm file:font-semibold
            file:bg-green-50 file:text-green-700
            hover:file:bg-green-100"
        />
        <button
          onClick={handleAttach}
          className={`${
            upload ? "bg-green-600" : "bg-gray-400"
          } text-white px-4 py-2 rounded-md`}
          disabled={!upload} // Disable the button until an image is uploaded
        >
          {!upload ? "Attached" : "Attach"}
        </button>
      </div>
      {/* Display preview if the image is attached */}
      {image && (
        <div className="mt-4">
          <img
            src={`${image}`}
            alt="Slider Preview"
            className="rounded-lg w-full h-60 object-cover"
          />
        </div>
      )}
    </div>
  );
};

export default UploadSlider;
