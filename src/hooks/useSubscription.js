import { useCallback, useContext, useEffect, useState } from "react";
import { axiosClient } from "../services/axios-client";
import { AuthContext } from "../context/AuthContex";
import { get, set } from "idb-keyval";
import { FormatError } from "../utils/formmaters";
import { onFailure } from "../utils/notifications/OnFailure";
import { onSuccess } from "../utils/notifications/OnSuccess";

const PACKAGES_KEY = "Packahes Database";

function useSubscription() {
 
  const { authDetails } = useContext(AuthContext);
  const [activePackage, setActivePackage] = useState();
  const client = axiosClient(authDetails?.token);
  const [error, setError] = useState({
    message: "",
    error: "",
  });
  const [packages, setPackages] = useState([]);
  
  const [loading, setLoading] = useState(false);
  // console.log(activePackage)
  const interviewPackages = packages.filter(
    (current) =>
      current.title.toLowerCase().includes("plus") ||
      current.title.toLowerCase().includes("premium")
  );
  // console.log(interviePackages)
  const isInterviewPackge = (interviewPackages?.find(
    (current) => current?.id === activePackage?.package_id
  ) || authDetails?.user?.role?.match('admin') || authDetails?.user?.user_type === 'exclusive') ? true : false;

  const getPackages = async () => {
    setLoading(true);
    try {
      const { data } = await client.get("/packages");
      const userPackage = data.data.sort((a,b) => Number(a.price) - Number(b.price))

      setPackages(userPackage);
      await set(PACKAGES_KEY, userPackage);
    } catch (error) {
      FormatError(error, setError, "Subscription Error");
    } finally {
      setLoading(false);
    }
  };

  const getActivePackage = async () => {
    setLoading(true);
    try {
      const { data } = await client.get(
        `/user-package-payment/${authDetails?.user?.id}`
      );
      if (data.data.length !== 0) {
        const byAscendingOrder = data.data.sort(
          (a, b) => new Date(a.created_at) - new Date(b.created_at)
        );
        setActivePackage(byAscendingOrder[byAscendingOrder.length - 1]);
      } else {
        setActivePackage(null);
      }
    } catch (error) {
      FormatError(error, setError, "Subscription Error");
      setActivePackage(2);
    } finally {
      setLoading(false);
    }
  };

  const makePaymentCheck = useCallback(async (reference, data) => {
    setLoading(true);
    try {
      const response = await client.post("/package-payment", {
        package_id: data.id,
        amount: data.price,
        transaction_id: reference.reference,
        payment_status: "successful",
        employee_auth_id: authDetails?.user?.id,
      });
      getActivePackage();
    } catch (error) {
      FormatError(error, setError, "Payment Error");
    } finally {
      setLoading(false);
    }
  }, []);

 const config = (data, handleSuccess) => {
  const priceInKobo = Number(data.price) * 100;

  // This function is triggered when the user closes the payment modal (cancels)
  const onClose = () => {
    // Set an error state if the user cancels the payment
    onFailure({
      message: "Payment was canceled",
      error: "Payment Cancellation Error",
    });
   
  };

  // This function is triggered when the payment is successful but might need validation
  const onSuccessHandler = (reference) => {
    handleSuccess(reference, data);
    onSuccess({
      message: "Payment Successful",
      success: "Hang on, validating payment...",
    });
  };

  // This function handles any error during the payment process
  const onError = (error) => {
    // Set an error state when there's an issue with payment
    setError({
      message: error.message || "An error occurred during payment",
      error: "Payment Error",
    });

    // Show error notification
    onFailure({
      message: "Payment failed",
      error: "There was an issue with your payment. Please try again.",
    });
  };

  return {
    reference: new Date().getTime().toString(),
    email: authDetails?.user?.email,
    amount: priceInKobo,
    publicKey: import.meta.env.VITE_LIVE_PUBLIC_KEY,
    text: "Paystack Button Implementation",
    onSuccess: onSuccessHandler, // Call onSuccessHandler for successful payments
    onClose: onClose,           // Call onClose if the user cancels the payment
    onError: onError,           // Call onError if there's an issue
  };
};



let idx=0;

  useEffect(() => {
    const initVals = async () => {
      try {
        const result = await get(PACKAGES_KEY);
        if (result) {
          setPackages(result)
        } else {
          await getPackages()
        }
      } catch (error) {
         console.log('Caught Error')
      }
     
    };
if(authDetails?.user?.role === "employer"){
  getActivePackage();
  initVals();
  console.log("render of subscription",( idx+1))
}
  
  }, [authDetails?.user]);

  useEffect(() => {
    if (error.error && error.message) {
      onFailure(error);
    }
  }, [error.error, error.message]);

  return {
    loading,
    packages,
    activePackage,
    isInterviewPackge,
    interviewPackages,
    config,
    makePaymentCheck,
    getActivePackage,
  };
}

export default useSubscription;
