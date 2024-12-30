import React, { useState } from "react";

const TextEditor = ({setBlog, blog}) => {

  const handleTextChange = (e) => {
    const { name, value } = e.target;
    setBlog((prev) => ({
      ...prev,
      [name]: value, // Properly update the specific field in the object
    }));
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mt-6">
      {/* Title Section */}
      <h3 className="text-lg font-semibold mb-4">Add Title</h3>
      <input
      type="text"
        name="title"
        value={blog?.title} // Bind to the title property
        onChange={handleTextChange}
        placeholder="Enter title here..."
        className="w-full h-14 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
      />

      {/* Content Section */}
      <h3 className="text-lg font-semibold mb-4 mt-6">Add Content</h3>
      <textarea
        name="description"
        value={blog?.description} // Bind to the content property
        onChange={handleTextChange}
        placeholder="Write your content here..."
        className="w-full h-40 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
      />
    </div>
  );
};

export default TextEditor;
