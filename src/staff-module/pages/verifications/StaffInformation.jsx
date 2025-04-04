import { useContext, useState } from "react";
import { useLocation } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContex";
import { axiosClient } from "../../../services/axios-client";
import { onSuccess } from "../../../utils/notifications/OnSuccess";
import { onFailure } from "../../../utils/notifications/OnFailure";
import { RiLoader2Fill } from "react-icons/ri";

function StaffInformation() {
  const location = useLocation();
  const { data } = location?.state;
  const [cart, setCart] = useState();
  const [loading, setLoading] = useState(false);
  const { authDetails } = useContext(AuthContext);
  const client = axiosClient(authDetails.token);
  const [cartItems, setCartItems] = useState(data.cartedItems);

  console.log(data.staff)
  const filterProfileDetails =
    data.staff &&
    Object.keys(data.staff.domestic_staff).filter(
      (currentKey) =>
        currentKey !== "created_at" &&
        currentKey !== "updated_at" &&
        currentKey !== "id" &&
        currentKey !== "staff_category" &&
        currentKey !== "staff_category" &&
        currentKey !== "guarantor_verification_status" &&
        currentKey !== "residence_verification_status" &&
        currentKey !== "medical_history_verification_status" &&
        currentKey !== "police_report_verification_status" &&
        currentKey !== "previous_employer_verification_status" &&
        currentKey !== "family_verification_status" &&
        currentKey !== "contact_information" &&
        currentKey !== "subcategory" &&
        currentKey !== "resume" &&
        currentKey !== "availability_status"
    );

  const disableButton = () => {
    const current = cartItems.find(
      (item) => item.domestic_staff_id === data.staff.id
    );

    if (current) return true;

    return false;
  };


  const updateCart = async () => {
    try {
      const { data } = await client.post("staff-cart/get", {
        user_id: authDetails.user.id,
        user_type: authDetails.user.role,
      });
      setCartItems(data.cart_items);
    } catch (error) {
      onFailure({
        message: "soemthing went wrong",
        error: "Error retriving carted items",
      });
    }
  };

  const addToCart = async () => {
    setLoading(true);
    try {
      const response = await client.post("/staff-cart/add", {
        user_id: authDetails.user.id,
        user_type: authDetails.user.role,
        domestic_staff_id: data.staff.id,
      });
      const result = await updateCart();
      onSuccess({
        message: "User sucessfully added",
        success: "Domestic staff added to cart successfully",
      });
    } catch (error) {
      onFailure({
        message: "Collection Failed",
        error: "Failed to add to collection",
      });
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full  px-12 flex  pt-5 flex-col gap-5">
      <div className="flex justify-between">
        <h1 className="text-xl font-semibold">
          {data.staff.domestic_staff["first_name"]} {data.staff.domestic_staff["surname"]}'s Profile
          Information{" "}
        </h1>
     
      </div>

      {data && (
        <>
          <div className="grid grid-cols-2 gap-x-3 gap-y-5 p-2 w-full text-gray-600">
            {filterProfileDetails.map((currentKey) => {
              const detail = data.staff.domestic_staff[currentKey];
              const labelText = currentKey.replace(/_/g, " ").toLowerCase();

              return (
                <div className="flex flex-col gap-1">
                  <label className="capitalize">{labelText}</label>
                  <span className="font-semibold">
                    {detail ? detail : "Nothing to show"}
                  </span>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

export default StaffInformation;
