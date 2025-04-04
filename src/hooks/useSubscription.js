import { useCallback, useContext, useEffect, useState } from "react";
import { axiosClient } from "../services/axios-client";
import { AuthContext } from "../context/AuthContex";
import { get, set } from "idb-keyval";
import { FormatError, extractErrorMessage } from "../utils/formmaters";
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
  const userId = authDetails?.user?.id;
  const userRole = authDetails?.user?.role;
  const userEmail = authDetails?.user?.email;
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
  ) || userRole?.match('admin') || authDetails?.user?.user_type === 'exclusive') ? true : false;

  const getPackages = async () => {
    setLoading(true);
    try {
      const { data } = await client.get("/packages");
      const userPackage = data.data.sort((a, b) => Number(a.price) - Number(b.price))

      setPackages(userPackage);
      await set(PACKAGES_KEY, userPackage);
    } catch (error) {
      FormatError(error, setError, "Subscription Error");
    } finally {
      setLoading(false);
    }
  };

  const getActivePackage = async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const { data } = await client.get(
        `/user-package-payment/${authDetails?.user?.id}`
      );
      if (data?.data) {
        // const byAscendingOrder = data.data.sort(
        //   (a, b) => new Date(a.created_at) - new Date(b.created_at)
        // );
        setActivePackage(data?.data);
      } else {
        setActivePackage(null);
      }
    } catch (error) {
      setError({message:"Subscription Error", error:extractErrorMessage(error)})
      setActivePackage(null);
    } finally {
      setLoading(false);
    }
  };

  const makePaymentCheck = useCallback(async (reference, data) => {
    if (!userId) return;
    setLoading(true);
    try {
      await client.post("/package-payment", {
        package_id: data.id,
        amount: data.price,
        quantity: data?.quantity,
        transaction_id: reference.reference,
        payment_status: "successful",
        employee_auth_id: userId,
      });
      getActivePackage();
    } catch (error) {
      FormatError(error, setError, "Payment Error");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const config = (data, handleSuccess) => {
    const priceInKobo = Number(data.price) * 100;

    return {
      reference: new Date().getTime().toString(),
      email: userEmail,
      amount: priceInKobo,
      publicKey: import.meta.env.VITE_LIVE_PUBLIC_KEY,
      text: "Paystack Button Implementation",
      onSuccess: (reference) => {
        handleSuccess(reference, data);
        onSuccess({ message: "Payment Successful", success: "Hang on, validating payment..." });
      },
      onClose: () => {
        onFailure({ message: "Payment was canceled", error: "Payment Cancellation Error" });
      },
      onError: (error) => {
        setError({ message: error.message || "An error occurred during payment", error: "Payment Error" });
        onFailure({ message: "Payment failed", error: "There was an issue with your payment. Please try again." });
      },
    };
  };



  let idx = 0;

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
    if (userRole === "employer") {
      getActivePackage();
      initVals();
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
