import React, { useEffect, useState } from 'react'
import Header from "./Header";
import UploadSlider from "./UploadSlider";
import PageAttributes from "./PageAttributes";
import TextEditor from "./TextEditor";
import SectionHeader from "../../../components/Landing/SectionHeader";

const CreateBlog = () => {
  const [image, setImage] = useState("https://via.placeholder.com/800x400");
  const [blog, setBlog] = useState({
    title: "",
    content: "",
  });
  // Function to calculate reading time
  const calculateReadingTime = (text) => {
    const wordsPerMinute = 200; // Average reading speed
    const words = text.split(/\s+/).length; // Count words
    return Math.ceil(words / wordsPerMinute); // Round up to the nearest minute
  };
  useEffect(() => {
    setBlog((prev) => ({
      ...prev,
      readingTime: calculateReadingTime(blog.description || "")
    }));
  }, [blog.description])
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center">
      <div className="w-full max-w-6xl bg-white shadow-lg p-6 rounded-lg">
        <Header />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-6">
          <div className="lg:col-span-2">
            <UploadSlider image={image} setImage={setImage} />
          </div>
          <PageAttributes />
        </div>
        <TextEditor setBlog={setBlog} blog={blog} />
        {/* Live Preview */}
        <div className="mt-6 bg-gray-100 p-4 rounded-lg min-h-20">
          <strong className="text-xl">Preview:</strong>
          <SectionHeader
            title={blog.title || "Blog Heading"}
            subtitle={blog?.description?.slice(0, 150) || "subtitle"}
            img={image}
            reads={blog.title && blog?.readingTime}
            time={blog.title && new Date().toLocaleDateString()}
          />

          <div className="relative max-w-[1400px] w-full mx-auto">
            <main className="relative mb-20 px-5 h-auto flex flex-col gap-5">
              <div className="prose max-w-none leading-8">
                <p>{blog.description || "Blog content"}</p>
              </div>
            </main>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreateBlog