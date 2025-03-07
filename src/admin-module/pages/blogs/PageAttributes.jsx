import React, { useState, useContext, useEffect } from "react";
import { ResourceContext } from "../../../context/ResourceContext";
import Selector from "../../../components/Selector";
import { axiosClient } from "../../../services/axios-client";
import { AuthContext } from "../../../context/AuthContex";
import { onSuccess } from "../../../utils/notifications/OnSuccess";
import { onFailure } from "../../../utils/notifications/OnFailure";
import { FaSpinner } from "react-icons/fa";

const PageAttributes = ({ setBlog, blog }) => {
  const [categories, setCategories] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editItem, setEditItem] = useState({ id: null, type: "", name: "" });
  const [deleteItem, setDeleteItem] = useState({ id: null, type: "" });
  const [isLoading, setIsLoading] = useState(false);
  const { authDetails } = useContext(AuthContext);
  const client = axiosClient(authDetails?.token, true);
  const { setGetAllBlogCategories, getAllBlogCategories } = useContext(ResourceContext);

  useEffect(() => {
    setGetAllBlogCategories((prev) => ({
      ...prev,
      isDataNeeded: true,
    }));
  }, []);

  useEffect(() => {
    if (getAllBlogCategories?.data) {
      const fetchedCategories = getAllBlogCategories.data.data || [];
      setCategories(fetchedCategories);
    }
  }, [getAllBlogCategories]);
useEffect(() => {
  const selectedCategory = categories?.find((c) => c.id === blog?.blog_category_id);

  if (
    selectedCategory &&  !selectedCategory?.subcategories?.find((s) => s.id === blog?.blog_sub_category_id)) {
    setBlog((prev) => ({
      ...prev,
      blog_sub_category_id: null, // Reset subcategory
    }));
  }
}, [blog?.blog_category_id]);

 

  const handleEditItem = async () => {
    if (editItem.name.trim()) {
      setIsLoading(true);
      setGetAllBlogCategories((prev) => ({ ...prev, isDataNeeded: false }));
      try {
        const endpoint =
          editItem.type === "category"
            ? `/blog/categories/${editItem.id}`
            : `/blog/subcategories/${editItem.id}`;

        const body = JSON.stringify(
          editItem.type === "category"
            ? { name: editItem.name }
            : { name: editItem.name, blog_category_id: blog?.blog_category_id }
        );

        await client.put(endpoint, body, {
          headers: { "Content-Type": "application/json" },
        });
        setGetAllBlogCategories((prev) => ({ ...prev, isDataNeeded: true }));
        onSuccess({
          message: `Updated ${editItem.type}`,
          success: `${editItem.type} Updated Successfully`,
        });
        setIsEditModalOpen(false);
      } catch (error) {
        onFailure({
          message: `${editItem.type} Update Error`,
          error: extractErrorMessages(error),
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleAddItem = async () => {
    if (editItem.name.trim()) {
      if (editItem.type === "subcategory" && !blog?.blog_category_id) {
        onFailure({ message: "Category is required for adding a subcategory" });
        return;
      }
      setIsLoading(true);
      setGetAllBlogCategories((prev) => ({ ...prev, isDataNeeded: false }));
      try {
        const endpoint =
          editItem.type === "category" ? `/blog/categories` : `/blog/subcategories`;

        const body = JSON.stringify(
          editItem.type === "category"
            ? { name: editItem.name }
            : { name: editItem.name, blog_category_id: blog?.blog_category_id }
        );

        await client.post(endpoint, body, {
          headers: { "Content-Type": "application/json" },
        });
        setGetAllBlogCategories((prev) => ({ ...prev, isDataNeeded: true }));
        onSuccess({
          message: `Added ${editItem.type}`,
          success: `${editItem.type} Added Successfully`,
        });
        setIsEditModalOpen(false);
      } catch (error) {
        onFailure({
          message: `${editItem.type} Add Error`,
          error: extractErrorMessages(error),
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleDeleteItem = async () => {
    if (!deleteItem.id) return;
    setGetAllBlogCategories((prev) => ({ ...prev, isDataNeeded: false }));
    setIsLoading(true);
    try {
      const endpoint =
        deleteItem.type === "category"
          ? `/blog/categories/${deleteItem.id}`
          : `/blog/subcategories/${deleteItem.id}`;

      await client.delete(endpoint, {
        headers: { "Content-Type": "application/json" },
      });
      if (deleteItem.type === "category") {
        setBlog((prev) => ({
          ...prev,
          blog_category_id: null,
          blog_sub_category_id: null,
        }));
      } else {
        setBlog((prev) => ({
          ...prev,
          blog_sub_category_id: null,
        }));
      }

      setGetAllBlogCategories((prev) => ({ ...prev, isDataNeeded: true }));
      onSuccess({
        message: `Deleted ${deleteItem.type}`,
        success: `${deleteItem.type} Deleted Successfully`,
      });
      setIsDeleteModalOpen(false);
    } catch (error) {
      onFailure({
        message: `${deleteItem.type} Delete Error`,
        error: extractErrorMessages(error),
      });
    } finally {
      setIsLoading(false);
    }
  };

  const extractErrorMessages = (error) =>
    `${Object.entries(error?.response?.data?.errors || {})
      .map(([key, value]) => `${value}`)
      .join(", ")}`;

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mt-6">
      <h3 className="text-lg font-semibold mb-4">Post Attributes</h3>

      {/* Category Management */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
        <Selector
          data={categories || []}
          selected={categories?.find((cat) => cat.id === blog?.blog_category_id)}
          setSelected={(category) =>
            setBlog((prev) => ({ ...prev, blog_category_id: category?.id }))
          }
        />
        <div className="flex gap-2 mt-3 flex-wrap text-sm font-semibold items-center">
          <button
            className={`text-green-600 ${!blog?.blog_category_id ? "opacity-50 cursor-not-allowed" : ""}`}
            disabled={!blog?.blog_category_id}
            onClick={() => {
              setIsEditModalOpen(true);
              setEditItem({
                id: blog?.blog_category_id,
                type: "category",
                name: categories?.find((c) => c.id === blog?.blog_category_id)?.name || "",
              });
            }}
          >
            Edit Category
          </button>
          <button
            className={`text-red-600 ${!blog?.blog_category_id ? "opacity-50 cursor-not-allowed" : ""}`}
            disabled={!blog?.blog_category_id}
            onClick={() => {
              setDeleteItem({ id: blog?.blog_category_id, type: "category" });
              setIsDeleteModalOpen(true);
            }}
          >
            Delete Category
          </button>
          <button
            className="text-green-600"
            onClick={() => {
              setIsEditModalOpen(true);
              setEditItem({ id: null, type: "category", name: "" });
            }}
          >
            Add Category
          </button>
        </div>
      </div>

      {/* Subcategory Management */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Subcategory</label>
        <Selector
          data={
            categories?.find((cat) => cat.id === blog?.blog_category_id)?.subcategories || []
          }
          selected={
            categories
              ?.find((cat) => cat.id === blog?.blog_category_id)
              ?.subcategories?.find((sub) => sub.id === blog?.blog_sub_category_id)
          }
          setSelected={(subcategory) =>
            setBlog((prev) => ({ ...prev, blog_sub_category_id: subcategory?.id }))
          }
        />
        <div className="flex gap-2 mt-3 flex-wrap text-sm font-semibold items-center">
          <button
            className={`text-green-600 ${!(blog?.blog_category_id && blog?.blog_sub_category_id) ? "opacity-50 cursor-not-allowed" : ""
              }`}
            disabled={!(blog?.blog_category_id && blog?.blog_sub_category_id)}
            onClick={() => {
              setIsEditModalOpen(true);
              setEditItem({
                id: blog?.blog_sub_category_id,
                type: "subcategory",
                name: categories
                  ?.find((c) => c.id === blog?.blog_category_id)
                  ?.subcategories?.find((s) => s.id === blog?.blog_sub_category_id)?.name || "",
              });
            }}
          >
            Edit Subcategory
          </button>

          <button
            className={`text-red-600 ${!(blog?.blog_category_id && blog?.blog_sub_category_id) ? "opacity-50 cursor-not-allowed" : ""}`}
            disabled={!(blog?.blog_category_id && blog?.blog_sub_category_id)}
            onClick={() => {
              setDeleteItem({ id: blog?.blog_sub_category_id, type: "subcategory" });
              setIsDeleteModalOpen(true);
            }}
          >
            Delete Subcategory
          </button>
          <button
            className={`text-green-600 ${!blog?.blog_category_id ? "opacity-50 cursor-not-allowed" : ""}`}
            disabled={!blog?.blog_category_id}
            onClick={() => {
              setIsEditModalOpen(true);
              setEditItem({ id: null, type: "subcategory", name: "" });
            }}
          >
            Add Subcategory
          </button>
        </div>
      </div>

      {/* Edit/Add Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-lg font-semibold mb-4">
              {editItem.id ? "Edit" : "Add"} {editItem.type}
            </h2>
            <input
              type="text"
              value={editItem.name}
              onChange={(e) =>
                setEditItem((prev) => ({ ...prev, name: e.target.value }))
              }
              className="w-full border rounded p-2 mb-4"
            />
            <div className="flex justify-between">
              <button
                className="bg-green-600 text-white px-4 py-2 rounded flex items-center justify-center gap-2"
                onClick={editItem.id ? handleEditItem : handleAddItem}
                disabled={isLoading}
              >
                Save Changes
                {isLoading && <FaSpinner className="animate-spin mr-2" />}
              </button>
              <button
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
                onClick={() => setIsEditModalOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-lg font-semibold mb-4">Confirm Delete</h2>
            <p className="mb-4">
              Are you sure you want to delete this {deleteItem.type}?
            </p>
            <div className="flex justify-between">
              <button
                className="bg-red-600 text-white px-4 py-2 rounded flex items-center justify-center gap-2"
                onClick={handleDeleteItem}
                disabled={isLoading}
              >
                Yes, Delete
                {isLoading && <FaSpinner className="animate-spin mr-2" />}
              </button>
              <button
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
                onClick={() => setIsDeleteModalOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PageAttributes;
