import { useContext, useEffect, useState } from "react";
import { axiosClient } from "../../../services/axios-client";
import { AuthContext } from "../../../context/AuthContex";
import { onFailure } from "../../../utils/notifications/OnFailure";
import { MdClose } from "react-icons/md";
import SearchComponent from "../../../components/staffs/SearchComponent";
import { FaExclamationCircle, FaShoppingCart,FaFileContract } from "react-icons/fa";
import StaffCard from "../../../components/staffs/StaffCard";
import PopUpBox from "../../../components/PopUpBox";
import FormButton from "../../../components/FormButton";
import { useNavigate } from "react-router-dom";

function DomesticStaff() {
  const navigate = useNavigate();
 const { authDetails } = useContext(AuthContext);
  const client = axiosClient(authDetails.token);
  const [domesticStaffs, setDomesticStaffs] = useState();
  const [loading, setLoading] = useState();
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState();
  const [searchResult, setSearcResult] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [conditions, setConditions] = useState(false);
  const [queryParams, setQueryParams] = useState();

  const handleQuerySubmit = async (directParams = null) => {
    try {
      setLoading(true);
      if (!queryParams && !directParams)
        throw new Error("No Query option selected");
      const { data } = await client.get(
        `/domesticStaff/get-staff?staff_category=staff&${directParams ? directParams : queryParams
        }`
      );
      setSearcResult(data.domesticStaff);
    } catch (error) {
      onFailure({
        message: "Artisan Error",
        error: "Failed to retrieve items/query is empty",
      });
      setSearcResult([]);
    } finally {
      setLoading(false);
      setConditions(false);
    }
  };

  const navigateToStaff = (data) =>
    navigate(`/applicant/staff/${categories.name}/${data.id}`, {
      state: { data: { staff: data, cartedItems: cartItems } },
    });

  const staffsToDisplay =
    searchResult.length > 0
      ? searchResult?.filter(
        (current) =>
          current?.staff_category === "staff" &&
        (current?.status === "pending" || current?.status === "approved")
      )
      : [];

  const handleCondition = (data, hasCategory) => {
    if (hasCategory) {
      setConditions(true);
      setQueryParams(data);
    } else {
      handleQuerySubmit(data);
    }
  };

  const navigateToCart = () =>
    navigate(`/applicant/staff/cart`, {
      state: { data: { items: cartItems, category: categories, type: 'staff' } },
    });

  const getCartItems = async () => {
    try {
      const { data } = await client.post("staff-cart/get", {
        user_id: authDetails.user.id,
        user_type: authDetails.user.role,
      });
      if (data.cart_items) {
        setCartItems(
          data.cart_items.filter(
            (current) => current.domestic_staff.staff_category === "staff"
          )
        );
      }
    } catch (error) {
      onFailure({
        message: "soemthing went wrong",
        error: "Error retriving carted items",
      });
    }
  };
  useEffect(() => {
    const initData = async () => {
      setLoading(true);

      try {
        const { data } = await client.get("/staff-categories");
        setCategories(data.data?.filter(one=>one.name.toLowerCase().includes("staff"))[0] || []);
     } catch (error) {
        onFailure({
          message: "Staff Error",
          error: "Failed to retrieve subcategories",
        });
      } finally {
        setLoading(false);
      }
    };

    initData();
    getCartItems();
  }, []);

  return (
    <>
      <PopUpBox isOpen={conditions}>
        <div className="w-[300px] md:w-[600px] h-max max-h-[400px] text-gray-500 p-5 items-center flex flex-col gap-4 bg-white">
          <MdClose
            className="flex-shrink-0 text-2xl text-red-600 place-self-end cursor-pointer"
            onClick={() => setConditions(!conditions)}
          />
          <h1 className="text-xl font-bold">Job Descriptions</h1>
          
          <div className="text-sm overflow-y-auto flex-1 prose"> 
          <p dangerouslySetInnerHTML={{ __html: selectedCategory?.description}} />
          </div>
          <FormButton onClick={() => handleQuerySubmit()} loading={loading}>
            Confirm and Search
          </FormButton>
        </div>
      </PopUpBox>
      <div className="h-full w-full flex flex-col py-2 gap-[15px]">
        <div className="flex flex-col w-full justify-between items-start gap-1">
          <section className="w-full flex gap-y-5 items-center gap-x-2 px-1">

            <div
              id="content"
              className="flex flex-col gap-2 bg-green-100 pr-5 p-2 w-[90%] md:w-fit text-xs md:text-sm"
            >
              <div className="flex w-full justify-between items-center">
                <span className="flex gap-2 items-center text-green-700">
                  Welcome to our domestic staffs hub <FaExclamationCircle />
                </span>

                <button
                  onClick={() => document.getElementById('content').classList.add('hidden')}
                  className="group hover:bg-red-500 hover:text-white p-1 text-red-600 text-md flex justify-between items-center"
                >
                  Close
                  <MdClose />
                </button>
              </div>

              <p>
                Here you can search for any domestic staff of your choice. Fill in the
                query parameters to begin your search.
              </p>
            </div>  
            
            <button
              onClick={() => navigate("/applicant/staff/contract-history", {
                state: {
                  data: { type: "staff" },
                }
              })}
              className="flex items-center gap-2 ml-auto"
            >
              <FaFileContract size="24" className="inline md:hidden" />
              <span className="hidden md:inline border-primaryColor px-3 py-1 border hover:bg-primaryColor hover:text-white text-sm">Contract History</span>
            </button>   
            
            <button className="my-5" onClick={navigateToCart}>
              <p className="relative cursor-pointer flex item-center">
                <FaShoppingCart size="24" />{" "}
                <span className="absolute top-[-15px] right-0 w-max h-max px-1 rounded-full bg-red-700 text-white text-xs">
                  {cartItems.length || 0}
                </span>
              </p>
            </button>     
          </section>
          
          <SearchComponent
            subCategories={categories.subcategories}
            handleQuerySubmit={handleCondition}
            title="Domestic Staff Position"
            setSelectedCategory={setSelectedCategory}
          />

          
        </div>

        {staffsToDisplay.length > 0 && (
          <div className="flex flex-col gap-3 mt-5">
            <span className="font-semibold text-yellow-600">
            Showing You Search Result
            </span>
            <ul className="w-full grid grid-cols-responsive gap-2">
              {staffsToDisplay?.map((current) => (
                <StaffCard
                  key={current?.id}
                  data={current}
                  onClick={navigateToStaff}
                  cartItems={cartItems}
                  setCartItems={setCartItems}
                  getCartItems={getCartItems}
                />
              ))}
            </ul>
          </div>
        )}
      </div>
    </>
  );
}

export default DomesticStaff;
