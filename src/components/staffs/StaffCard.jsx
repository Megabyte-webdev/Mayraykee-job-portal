import { useContext, useState } from "react";
import FormButton from "../FormButton";
import PopUpBox from "../PopUpBox";
import { useForm } from "react-hook-form";
import { MdCheck, MdClose } from "react-icons/md";
import { AuthContext } from "../../context/AuthContex";
import { axiosClient, resourceUrl } from "../../services/axios-client";
import { onSuccess } from "../../utils/notifications/OnSuccess";
import { onFailure } from "../../utils/notifications/OnFailure";
import { PaystackConsumer } from "react-paystack";
import { useNavigate } from "react-router-dom";
import { FormatPrice } from "../../utils/formmaters";
import useStaff from "../../hooks/useStaff";
import { allStatus } from "../../hooks/useStaffUser";

const PUBLIC_KEY = import.meta.env.VITE_TEST_PUBLIC_KEY;

function StaffCard({ data, contract = null, cartItems, getCartItems }) {
  const { register, handleSubmit } = useForm();
  const { authDetails } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [cartloading, setCartLoading] = useState(false);
  const client = axiosClient(authDetails?.token);
  const { getStyling } = useStaff();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);

  const toogleOpen = () => setOpen(!open);

  const handleContract = async (dataToSubmit) => {
    setLoading(true);
    try {
      const response = await client.post("/contracts/create", {
        ...dataToSubmit,
        user_id: authDetails.user.id,
        user_type: authDetails.user.role,
        domestic_staff_id: data.domestic_staff_id,
      });
      const { dataTwo } = await client.post("/staff-cart/remove", {
        user_id: authDetails.user.id,
        user_type: authDetails.user.role,
        domestic_staff_id: data.domestic_staff_id,
      });
      await getCartItems();
      onSuccess({
        message: "Contract successful",
        success: "The Contract has been created",
      });
      toogleOpen();
    } catch (error) {
      console.log(error);
      onFailure({
        message: "Contract unsuccessful",
        error: "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async () => {
    setCartLoading(true);
    try {
      const response = await client.post("/staff-cart/add", {
        user_id: authDetails.user.id,
        user_type: authDetails.user.role,
        domestic_staff_id: data.id,
      });
      await getCartItems();
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
      setCartLoading(false);
    }
  };

  const removeFromCart = async () => {
    setCartLoading(true);
    try {
      const response = await client.post("/staff-cart/remove", {
        user_id: authDetails.user.id,
        user_type: authDetails.user.role,
        domestic_staff_id: data.id,
      });
      await getCartItems();
      onSuccess({
        message: "User sucessfully removed",
        success: "Domestic staff removed from cart successfully",
      });
      
    } catch (error) {
      onFailure({
        message: "Cart Failed",
        error: "Failed to remove staff from cart",
      });
      console.log(error);
    } finally {
      setCartLoading(false);
    }
  };

  const config = (handleSuccess) => {
    const priceInKobo = Number(1000) * 100;
    const onClose = () => {
      onFailure({
        message: "Payment Sucessful",
        error: "Hang on, validating payment...",
      });
    };

    return {
      reference: new Date().getTime().toString(),
      email: authDetails?.user?.email,
      amount: priceInKobo,
      publicKey: PUBLIC_KEY,
      text: "Paystack Button Implementation",
      onSuccess: (reference) => handleSuccess(reference, data),
      onClose: onClose,
    };
  };

  const handleSuccess = async (reference) => {
    console.log(reference);
    setCartLoading(true);
    try {
      const response = await client.post("/staff-cart/checkout", {
        user_id: authDetails.user.id,
        user_type: authDetails.user.role,
        domestic_staff_id: data.domestic_staff_id,
        reference: reference.reference,
      });
      onSuccess({
        message: "User sucessfully added",
        success: "Domestic staff added to cart successfully",
      });

      navigate(`/company/staff/staff/${data.id}`, {
        state: { data: { staff: data, cartedItems: cartItems } },
      });
    } catch (error) {
      onFailure({
        message: "Collection Failed",
        error: "Failed to add to collection",
      });
    } finally {
      setCartLoading(false);
    }
  };

  const getField = (name) => {
    if (data?.domestic_staff) {
      return data?.domestic_staff[name];
    } else if(data[name]) {
      return data[name];
    } else{
      return 'No data found'
    }
  };

  const getVerificationComp = (status, name) => {
    let utils = {
      icon: "",
      name: "",
      bg: "",
    };

    const detail =
      allStatus.find((current) => current === status) || "Not Recorded";
    if (name === "garantor") {
      // console.log('Detail', detail);
      // console.log('Status', status);
    }

    switch (name) {
      case "police":
        utils = {
          icon: "/police-icon.png",
          name: `Police - (${detail})`,
          bg: getStyling(detail),
        };
        break;
      case "residence":
        utils = {
          icon: "/residence-icon.png",
          name: `Residence - (${detail})`,
          bg: getStyling(detail),
        };
        break;
      case "garantor":
        utils = {
          icon: "/garantor-icon.png",
          name: `Garantor - (${detail})`,
          bg: getStyling(detail),
        };
        break;
      case "medical":
        utils = {
          icon: "/medical-icon.png",
          name: `Medical - (${detail})`,
          bg: getStyling(detail),
        };
        break;
    }

    return (
      <span
        className={`w-full py-2 flex items-center px-3 gap-4 text-white ${utils.bg}`}
      >
        <img src={utils.icon} className="h-[20px]" />
        {utils.name}
      </span>
    );
  };

  const userVerified =
    data.residence_verification_status === allStatus[0] &&
    data.guarantor_verification_status === allStatus[0] &&
    data.police_report_verification_status === allStatus[0] &&
    data.medical_history_verification_status === allStatus[0];

  return (
    <>
      <PopUpBox isOpen={open}>
        <div className="w-[30%] p-3 gap-3 rounded-lg  flex flex-col bg-white">
          <MdClose
            onClick={toogleOpen}
            type="date"
            className="place-self-end text-lg cursor-pointer"
          />
          <label className="text-sm font-semibold">Contract Start Date</label>
          <input
            type="date"
            {...register("start_date")}
            className="p-2 border focus:outline-none"
            placeholder="Enter language..."
          />
          <label className="text-sm mt-5 font-semibold">
            Contract Start Date
          </label>
          <input
            type="date"
            {...register("end_date")}
            className="p-2 border focus:outline-none"
            placeholder="Enter language..."
          />

          <FormButton
            loading={loading}
            onClick={handleSubmit((data) => {
              console.log(data);
              handleContract(data);
            })}
          >
            Proceed
          </FormButton>
        </div>
      </PopUpBox>
      <div className="relative pt-[50px] bg-white my-[50px] min-h-fit flex gap-2 shadow-[0_0_2px_#ccc] rounded-lg flex-col justify-between px-3 md:p-10 border">
        {getField("profile_image") ? (
          <img
            src={`${resourceUrl}${getField("profile_image")}`}
            className="absolute left-0 right-0 mx-auto top-[-50px] h-[100px] place-self-center w-[100px] rounded-full "
            alt=""
          />
        ) : (
          <img
            src={`/placeholder.png`}
            className="absolute left-0 right-0 mx-auto top-[-50px] h-[100px] bg-gray-300 place-self-center w-[100px] rounded-full "
            alt=""
          />
        )}

        {
          <img
            src={userVerified ? `/verified-badge.png` : "/unverified-badge.png"}
            className="absolute right-[10px] mx-auto top-[10px] h-[30px]  place-self-center  rounded-full "
            alt=""
          />
        }
        <div className="flex flex-col gap-2 py-2 mt-[50px]">
          <span className="flex items-center justify-between gap-2 text-md font-semibold">
            Name:
            <span className="text-sm w-[60%] text-start font-normal text-gray-500 capitalize">
              {getField("first_name")} {getField("surname")}
            </span>
          </span>

          <span className="flex gap-2 items-center justify-between text-md font-semibold">
            Age Range:
            <span className="text-sm w-[60%] text-start font-normal text-gray-500">
              {getField("age") ?? `${getField("age")} Years`}
            </span>
          </span>

          <span className="flex gap-2 items-center justify-between text-md font-semibold">
            Category:
            <span className="text-sm w-[60%] text-start font-normal text-gray-500">
              {getField("subcategory")}
            </span>
          </span>

          <span className="flex gap-2 items-center justify-between text-md font-semibold">
            Ethnicity:
            <span className="text-sm w-[60%] text-start font-normal text-gray-500">
              {getField("ethnicity")}
            </span>
          </span>

          <span className="flex gap-2 items-center justify-between text-md font-semibold">
            Gender:
            <span className="text-sm w-[60%] text-start font-normal text-gray-500">
              {getField("gender")}
            </span>
          </span>

          {/* <span className="flex gap-2 items-center justify-between text-md truncate font-semibold">
            Gender:
            <span className="text-sm w-[60%] text-start font-normal text-gray-500">
              {getField("gender")}
            </span>
          </span> */}

          <span className="flex gap-2 items-center justify-between text-md font-semibold">
            Religion:
            <span className="text-sm w-[60%] text-start font-normal text-gray-500">
              {getField("religion")}
            </span>
          </span>

          <span className="flex gap-2 items-center justify-between text-md truncate font-semibold">
            Langages:
            <span className="text-sm w-[60%] flex text-start font-normal text-gray-500">
              {getField("languages_spoken") ?? getField("languages_spoken")?.map((current, idx) => (
                <span key={idx} className="group">
                  {current}
                  <span className="group-last:hidden">, </span>
                </span>
              ))}
            </span>
          </span>

          <span className="flex gap-2 items-center justify-between text-md truncate font-semibold">
            Education:
            <span className="text-sm w-[60%] text-start font-normal text-gray-500">
              {getField("education_level")}
            </span>
          </span>

          <span className="flex gap-2 items-center justify-between text-md truncate font-semibold">
            Marital Status:
            <span className="text-sm w-[60%] text-start font-normal text-gray-500">
              {getField("marital_status")}
            </span>
          </span>

          <span className="flex gap-2 items-center justify-between text-md truncate font-semibold">
            Years of Experience:
            <span className="text-sm w-[60%] text-start font-normal text-gray-500">
              {getField("years_of_experience") ?? `getField("years_of_experience") Years`} 
            </span>
          </span>

          <span className="flex gap-2 items-center justify-between text-md truncate font-semibold">
            <img src="/price-tag.png" className="w-[30px]" />
            Professional Fees:
            <span className="text-sm w-[60%] text-start font-normal text-gray-500">
              {FormatPrice(10000)}
            </span>
          </span>
        </div>

        <div className="flex w-full gap-2 flex-col my-3">
          {getVerificationComp(
            data.police_report_verification_status,
            "police"
          )}
          {getVerificationComp(data.guarantor_verification_status, "garantor")}
          {getVerificationComp(data.residence_verification_status, "residence")}
          {getVerificationComp(
            data.medical_history_verification_status,
            "medical"
          )}
        </div>

        {!contract && (
          <div className="w-full flex flex-col gap-2">
            {cartItems?.some((current) =>data.id === current.domestic_staff_id) ? (
              <FormButton
                loading={cartloading}
                onClick={removeFromCart}
                width="h-fit bg-red-500 border border-black text-black bg-white text-sm py-2"
              >
                Remove from cart
              </FormButton>
            ) : (
              <>
                <FormButton
                  loading={cartloading}
                  onClick={addToCart}
                  width="h-fit text-sm py-2 border border-black text-black bg-white"
                >
                  Add to Cart
                </FormButton>
              </>
            )}
          </div>
        )}
      </div>
    </>
  );
}

export default StaffCard;
