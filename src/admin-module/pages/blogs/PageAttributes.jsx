import React, { useState } from "react";

const PageAttributes = () => {
  const [selectedParent, setSelectedParent] = useState("");
  const [featuredImage, setFeaturedImage] = useState(null);

  const handleParentChange = (e) => {
    setSelectedParent(e.target.value);
  };

  const handleFeaturedImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFeaturedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mt-6">
      <h3 className="text-lg font-semibold mb-4">Page Attributes</h3>

      {/* Parent Dropdown */}
      <div className="mb-6">
        <label
          htmlFor="parent-category"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Parents
        </label>
        <select
          id="parent-category"
          value={selectedParent}
          onChange={handleParentChange}
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none"
        >
          <option value="">Select Parent</option>
          <option value="policy-statements">Policy Statements</option>
          <option value="guidelines">Guidelines</option>
          <option value="faq">FAQ</option>
        </select>
      </div>

      {/* Featured Image */}
      <div>
        <label
          htmlFor="featured-image"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Feature Image
        </label>
        <input
          type="file"
          id="featured-image"
          accept="image/*"
          onChange={handleFeaturedImageUpload}
          className="block w-full text-sm text-gray-600
            file:mr-4 file:py-2 file:px-4
            file:rounded file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100"
        />
        {featuredImage && (
          <div className="mt-4">
            <img
              src={featuredImage}
              alt="Featured Preview"
              className="w-full h-40 rounded-lg"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default PageAttributes;
