import { FaExclamationCircle } from "react-icons/fa";
import { MdCheck, MdCheckBoxOutlineBlank, MdClose } from "react-icons/md";
import { useLocation, useNavigate } from "react-router-dom";
import StaffCard from "./StaffCard";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContex";
import { axiosClient } from "../../services/axios-client";
import { onFailure } from "../../utils/notifications/OnFailure";
import { FormatPrice } from "../../utils/formmaters";
import { CONMPANY_TAX } from "../../utils/base";
import { PaystackConsumer } from "react-paystack";
import useCart from "../../hooks/useCart";
import MarketPlace from "./marketplace/MarketPlace";
import PopUpBox from "../PopUpBox";
import {FaArrowLeftLong} from "react-icons/fa6"

import FormButton from "../FormButton";

function CartedStaffs() {
  const location = useLocation();
  const { data } = location?.state ? location?.state : { data: null };
  const navigate = useNavigate();
  const { authDetails } = useContext(AuthContext);
  const client = axiosClient(authDetails.token);
  const [cartItems, setCartItems] = useState(data?.items || []);
  const { config, handleSuccess, addToCart, removeFromCart } = useCart();
  const [conditions, setConditions] = useState(false);
  const [terms, setTerms] = useState(false);

  // cart ui logic
  const [selectedItems, setSelectedItems] = useState([]);
  const allSelected = selectedItems.length === cartItems.length;

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      // Select all items
      setSelectedItems(cartItems);
    } else {
      // Deselect all items
      setSelectedItems([]);
    }
  };

  const handleItemSelect = (item) => {
    if (selectedItems.includes(item)) {
      setSelectedItems(selectedItems.filter((i) => i !== item));
    } else {
      setSelectedItems([...selectedItems, item]);
    }
  };
  

  //cart ui logic ended
  const navigateToStaff = (staff) =>
    navigate(`/company/staff/${data.category.name}/${staff.id}`, {
      state: { data: { staff: staff, cartedItems: data.cartItems } },
    });

  //cart items from api
  const getCartItems = async () => {
    const type = data.type
    try {
      const { data } = await client.post("staff-cart/get", {
        user_id: authDetails.user.id,
        user_type: authDetails.user.role,
      });
      if (data.cart_items) {
        setCartItems(data.cart_items?.filter(
          (current) => current.domestic_staff.staff_category === type
        ));
      } else {
        setCartItems([]);
      }
      // setCartItems(
      //   data.cart_items.filter(
      //     (current) =>
      //       current.domestic_staff.staff_category === location.state.data.type
      //   )
      // );
    } catch (error) {
      onFailure({
        message: "soemthing went wrong",
        error: "Error retriving carted items",
      });
    }
  };

  //contract items from api
  const handleAddToCart = async (data) => {
    await addToCart(getCartItems, data);
  };

  const handleRemoveCart = async (data) => {
    await removeFromCart(getCartItems, data);
  };

  //

  useEffect(() => {
    getCartItems();
  }, []);

  return (
    <>
    <button
          type="button"
          onClick={() => window.history.back()}
          className="w-max flex items-center gap-2 outline outline-offset-5 outline-green-500 px-4 py-2 rounded text-green-500 hover:bg-green-100"
        >
       <FaArrowLeftLong className="me-4 text-green-500" />Back
        </button>
      <PopUpBox isOpen={conditions}>
        <div className="w-[90%] md:w-[40%] md:h-fit text-gray-500 p-5 items-center flex flex-col gap-4 bg-white">
          <MdClose
            className="text-2xl place-self-end cursor-pointer"
            onClick={() => setConditions(!conditions)}
          />
          <h1>Terms and Conditions</h1>
          <p className="text-sm">
            This agreement acknowledges that the employer may only assign tasks
            that are directly related to the designated role of the employee.
            Artisan must only perform duties as outlined within the scope of
            their specific role, whether as a housekeeper, driver, or other
            position. Any tasks outside these roles require mutual agreement
            between the employer and the employee. Violation of this policy may
            result in a breach of contract or legal consequences, depending on
            applicable labor laws..
          </p>
          <div
            onClick={() => setTerms(!terms)}
            className="flex cursor-pointer items-center gap-3"
          >
            {terms ? (
              <MdCheck size={20} className="text-primaryColor" />
            ) : (
              <MdCheckBoxOutlineBlank size={20} />
            )}
            <span>I accept the terms and conditions</span>
          </div>
          <PaystackConsumer
            {...config(
              handleSuccess,
              selectedItems,
              getCartItems,
              (selectedItems.length > 0
                ?
                selectedItems.reduce(
                  (total, item) => Number(total + CONMPANY_TAX) + Number(item?.domestic_staff?.expected_salary || 0),
                  0
                )
                : 0)
            )}
          >
            {({ initializePayment }) => (
              <FormButton
                onClick={() => {
                  if (terms) {
                    initializePayment();
                  } else {
                    onFailure({
                      message: "Terms and Condtions",
                      error:
                        "Please agree to the terms by cliking the check box",
                    });
                  }
                }}
              >
                Checkout
              </FormButton>
            )}
          </PaystackConsumer>
        </div>
      </PopUpBox>
      <div className="w-full flex  pt-5 flex-col gap-5">

        <div
          id="content"
          className="flex flex-col gap-2 bg-green-100 pr-5 p-2 w-[90%] md:w-fit text-xs md:text-sm"
        >
          <div className="flex w-full justify-between items-center">
            <span className="flex gap-2 items-center text-green-700">
              Here are a list of your carted staffs
              <FaExclamationCircle />
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
            Here you can sign a contract with any artisan of your choice. Click
            on sign to sign them or view to view thier details
          </p>
        </div>

        {/* Shopping Cart */}
        {cartItems.length !== 0 ? (
          <div className="flex flex-col md:flex-row gap-8">
            <div className="w-full min-w-72 md:w-2/3 bg-white p-6">
              <h2 className="text-lg font-bold mb-4">Shopping Cart</h2>

              <p className="text-sm text-gray-600 mb-4">
                Showing {cartItems.length} staffs you added
              </p>

              <div className="mb-4">
                <input
                  type="checkbox"
                  id="selectAll"
                  checked={allSelected}
                  onChange={handleSelectAll}
                  className="mr-2 cursor-pointer"
                />
                <label htmlFor="selectAll" className="text-gray-700">
                  Select All{" "}
                  <span className="text-gray-500">({cartItems.length})</span>
                </label>
              </div>

              {/* Cart Items */}
              <div className="space-y-6">
                {cartItems?.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center border-b pb-4 border-gray-200"
                  >
                    <input
                      checked={selectedItems.includes(item)}
                      onChange={() => {
                        console.log(item);
                        handleItemSelect(item);
                        // if (item.domestic_staff.availability_status === '1') {
                        //   handleItemSelect(item);
                        // } else {
                        //   onFailure({
                        //     message: "Availabilty status",
                        //     error:
                        //       "Only available staffs can be checked out.",
                        //   });
                        // }
                      }}
                      type="checkbox"
                      className="mr-4 cursor-pointer"
                    />
                    <div className="flex-grow flex gap-2 items-center">
                      <img
                        src={`/placeholder.png`}
                        className="h-[80px] bg-gray-300 place-self-center w-[80px]"
                        alt=""
                      />
                      <section className="w-full">
                        <p className="text-xs flex gap-5 w-full justify-between  uppercase text-gray-500">
                          {item?.domestic_staff?.subcategory}
                          <span className={`text-md ${item.domestic_staff.availability_status === '1' ? 'text-green-600' : 'text-red-600'}`}>{item.domestic_staff.availability_status === '1' ? 'Available' : 'Unavailable'}</span>
                        </p>
                        <p className="text-base font-medium capitalize">
                          {`${item?.domestic_staff?.surname} ${item?.domestic_staff?.first_name} ${item?.domestic_staff?.middle_name}`}
                        </p>
                        <p className="text-sm text-gray-700">
                          {FormatPrice(parseFloat(item?.domestic_staff?.expected_salary))}
                        </p>
                      </section>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="w-full min-w-[250px] h-fit md:w-1/3 bg-white border border-black p-6 rounded shadow">
              <h2 className="text-lg font-bold mb-4">Order Summary</h2>
              <ul className="space-y-2 mb-6">
                {selectedItems?.map((item) => (
                  <li key={item.id} className="flex justify-between text-sm">
                    <span className="capitalize">
                      {`${item?.domestic_staff?.subcategory} - ${item?.domestic_staff?.surname} ${item?.domestic_staff?.first_name}`}
                    </span>
                    <span>{FormatPrice(parseFloat(item?.domestic_staff?.expected_salary))}</span>
                  </li>
                ))}
              </ul>
              <ul className="border-t pt-4">
                <li className="flex justify-between text-sm mb-2">
                  <span>Total Price (Item)</span>
                  <span>{selectedItems.length > 0
                    ? FormatPrice(
                      selectedItems.reduce(
                        (total, item) => parseFloat(Number(total) + Number(item?.domestic_staff?.expected_salary || 0)),
                        0
                      )
                    )
                    : 0}</span>
                </li>
                <li className="flex justify-between text-sm mb-2">
                  <span>Tax Fee</span>
                  <span>{selectedItems.length > 0 ? FormatPrice(CONMPANY_TAX * selectedItems.length) : 0}</span>
                </li>
                <li className="flex justify-between font-bold text-lg">
                  <span>Grand Total</span>
                  <span>
                    {selectedItems.length > 0
                      ? FormatPrice(
                        selectedItems.reduce(
                          (total, item) => Number(total + CONMPANY_TAX) + Number(item?.domestic_staff?.expected_salary || 0),
                          0
                        )
                      )
                      : 0}
                  </span>
                </li>

              </ul>
              <button
                className={`${selectedItems.length > 0
                  ? "opacity-100 cursor-pointer"
                  : "opacity-50 cursor-not-allowed"
                  } w-full bg-black font-semibold text-white py-3 rounded-full mt-6`}
                height="h-fit text-sm p-1"
                disabled={selectedItems.length > 0 ? false : true}
                onClick={() => {
                  setConditions(!conditions);
                }}
              >
                Checkout
              </
              button>
            </div>
          </div>
        ) : (
          <h2 className="text-lg font-bold mb-4">Cart Empty</h2>
        )}

        {/* Contract Details & Market place*/}
        <MarketPlace handleAddToCart={handleAddToCart} />
      </div>
    </>
  );
}

export default CartedStaffs;
