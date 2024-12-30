import { useContext, useEffect, useState } from "react";
import { axiosClient } from "../services/axios-client";
import { onFailure } from "../utils/notifications/OnFailure";
import StaffCard from "./StaffCard";
import { useNavigate, useParams } from "react-router-dom";
import Hero from "../components/Landing/Hero";
import Navbar from "../components/Landing/Navbar";
import Advert from "../components/Landing/Advert";
import Footer from "../components/Landing/Footer";

function FindStaff() {
  const { id } = useParams();
  const client = axiosClient();
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubCategories] = useState([]);
  const [searchResult, setSearchResult] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [ageRange, setAgeRange] = useState("");
  const [gender, setGender] = useState("");
  const [educationalLevel, setEducationalLevel] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await client.get("/staff-categories");
        if (data?.data) {
          setCategories(data.data);
        } else {
          setCategories([]);
        }
      } catch (error) {
        onFailure({
          message: "Category Error",
          error: "Failed to retrieve staff categories.",
        });
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    if (categories.length > 0 && id) {
      const matchedCategory = categories.find(
        (category) => category.name.toLowerCase() === id.toLowerCase()
      );
      if (matchedCategory) {
        setSelectedCategory(matchedCategory.name);
        } else {
        navigate("/not-found");
      }
    }
  }, [categories, id]);

  const handleQuerySubmit = async (queryParams) => {
    if (!queryParams?.staff_category) {
      return;
    }

    try {
      const query = new URLSearchParams(queryParams).toString();
      const { data } = await client.get(`/domesticStaff/staff-type?${query}`);
      setSearchResult(data?.domesticStaff || []);
    } catch (error) {
      onFailure({
        message: `${id} Search Error`,
        error: "Failed to retrieve search results.",
      });
      setSearchResult([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchClick = async () => {
  setLoading(true);
  if (!selectedCategory) {
    return;
  }

  // Reset subcategory if it doesn't belong to the current category
  const validSubcategories = categories.find(
    (category) => category.name === selectedCategory
  )?.subcategories.map((sub) => sub.name) || [];

  if (!validSubcategories.includes(selectedSubcategory)) {
    setSelectedSubcategory("");
  }

  const queryParams = {
    staff_category:
      selectedCategory?.toLowerCase() === "domestic staff"
        ? "staff"
        : selectedCategory?.toLowerCase(),
    ...(validSubcategories.includes(selectedSubcategory) && {
      subcategory: selectedSubcategory,
    }),
    ...(ageRange && { age_range: ageRange }),
    ...(gender && { gender }),
    ...(educationalLevel && { education_level: educationalLevel }),
  };

  await handleQuerySubmit(queryParams);
};
  

  useEffect(() => {
    handleSearchClick(); // Trigger search only when valid category is set
      
    const selectedCategoryData = categories?.find(
      (category) => category.name === selectedCategory
    );
    setSubCategories(selectedCategoryData ? selectedCategoryData.subcategories : []);
    setSelectedSubcategory("");
  }, [categories, selectedCategory]);

  const filteredSearchResult = searchInput
    ? searchResult.filter(
      (staff) =>
        staff.first_name?.toLowerCase().includes(searchInput.toLowerCase()) ||
        staff.surname?.toLowerCase().includes(searchInput.toLowerCase())
    )
    : searchResult;

  return (
    categories && searchResult && (
      <>
        <div className="relative max-w-[1400px] w-full mx-auto">
          <Navbar />
          <main className="relative my-20 px-5 h-full">
            <Hero shrink={true} title={selectedCategory?.toLowerCase() !== "domestic staff"
              ? "Connect with skilled artisans in your area. Quality craftsmanship and expertise, just a step away!" : "Discover reliable domestic staff near you. Experience peace of mind with trusted professionals for your home!"} />
            

              {/* Filter Section */}
              <div className="w-full px-6 bg-[#AFB6AE1A] rounded-lg shadow-md h-fit flex flex-col gap-6">
                <h2 className="text-lg font-semibold text-gray-800 mt-1">
                  Find {selectedCategory}
                </h2>
                <div className="h-full w-full flex flex-col bg-transparent">
              {/* Search Bar */}
              <div className="flex flex-wrap rounded-md mb-3">
                <input
                  type="text"
                  value={searchInput}
                  onInput={(e) => setSearchInput(e.target.value)}
                  placeholder={`Search ${selectedCategory} by name e,g Ben`}
                  className="p-3 py-2 border border-gray-300 rounded-lg flex-1 focus:outline-primaryColor"
                />

              </div>
                {/* Filter Options */}
                <div className="grid grid-cols-responsive3 gap-3">
                  {/* Category Dropdown */}
                  <div className="flex flex-col">
                    <label htmlFor="category" className="text-sm font-medium text-gray-600 mb-2">Category</label>
                    <select
                      id="category"
                      disabled
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryColor focus:border-transparent disabled:opacity-50"
                    >
                      <option value="">Select category</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.name}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Subcategory Dropdown */}
                  <div className="flex flex-col">
                    <label htmlFor="subcategory" className="text-sm font-medium text-gray-600 mb-2">Subcategory</label>
                    <select
                      id="subcategory"
                      value={selectedSubcategory}
                      onChange={(e) => setSelectedSubcategory(e.target.value)}
                      className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryColor focus:border-transparent"
                    >
                      <option value="">Select Subcategory</option>
                      {subcategories?.map((subcategory) => (
                        <option key={subcategory.id} value={subcategory.name}>
                          {subcategory.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Age Range Dropdown */}
                  <div className="flex flex-col">
                    <label htmlFor="age_range" className="text-sm font-medium text-gray-600 mb-2">Age Range</label>
                    <select
                      id="age_range"
                      value={ageRange}
                      onChange={(e) => setAgeRange(e.target.value)}
                      className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryColor focus:border-transparent"
                    >
                      <option value="">Select Age Range</option>
                      <option value="18-25">18-25</option>
                      <option value="26-35">26-35</option>
                      <option value="36-45">36-45</option>
                      <option value="46+">46+</option>
                    </select>
                  </div>

                  {/* Gender Dropdown */}
                  <div className="flex flex-col">
                    <label htmlFor="gender" className="text-sm font-medium text-gray-600 mb-2">Gender</label>
                    <select
                      id="gender"
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryColor focus:border-transparent"
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                  </div>

                  {/* Educational Level Dropdown */}
                  <div className="flex flex-col">
                    <label htmlFor="education_level" className="text-sm font-medium text-gray-600 mb-2">Education Level</label>
                    <select
                      id="education_level"
                      value={educationalLevel}
                      onChange={(e) => setEducationalLevel(e.target.value)}
                      className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryColor focus:border-transparent"
                    >
                      <option value="">Select Education Level</option>
                      {[
                        "Primary School Certificate",
                        "Secondary School Certificate",
                        "Diploma",
                        "Degree",
                      ].map((current) => (
                        <option key={current}>{current}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Search Button */}
                <div className="flex justify-center my-3">
                  <button
                    onClick={handleSearchClick}
                    className="w-full md:w-60 px-6 py-3 bg-primaryColor text-white rounded-lg hover:bg-primaryHover transition-all shadow-lg text-center font-semibold"
                  >
                    Filter
                  </button>
                </div>
              </div>

              {/* Results */}
              <div className="mt-5">
                {loading ? (
                  <div className="flex justify-center items-center mt-10 min-h-60 bg-gray-100">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-green-600"></div>
                  </div>
                ) : (
                  <div className="grid grid-cols-responsive2 gap-4 bg-gray-100 p-2">
                    {filteredSearchResult?.length > 0 ? (
                      filteredSearchResult.map((staff) => (
                        <StaffCard key={staff.id} staff={staff} />
                      ))
                    ) : (
                      <p>No {selectedCategory} found matching your criteria.</p>
                    )}
                  </div>
                )}
              </div>
            </div>
            <Advert />
          </main>
        </div>
        <Footer />
      </>
    )
  );
}

export default FindStaff;
