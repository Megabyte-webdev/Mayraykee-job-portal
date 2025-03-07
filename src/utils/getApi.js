import axios from "axios";
import { BASE_URL } from "./base";

export const getUpdatedUser = (
  token,
  setDataState,
  setErrorMessage,
  endPoint,
  dataArray,
  setChecker
) => {
  const fleetTypesApi = `${BASE_URL}${endPoint}`;
  let newFleetMakesData = [];
  if (token)
    axios
      .get(fleetTypesApi, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        // console.log(response);
        const apiData = response.data;
        if (!apiData.details) {
          setChecker(true)
        }
        // console.log(apiData.details == null);
        // apiData?.map((item) => {
        //   newFleetMakesData.push({
        //     id: item.id,
        //     ...item,
        //   });
        // });
        // localStorage.setItem("userDetails", JSON.stringify(apiData));
        setDataState((prev) => {
          return {
            data: apiData,
            isDataNeeded: prev.isDataNeeded,
          };
        });
      })
      .catch((error) => {
        console.log(error);
        if (error.response) {
          setErrorMessage(error.response.data.message);
        } else {
          setErrorMessage(error.message);
        }
      });
};

export const getItemFunc = (
  token,
  setDataState,
  setErrorMessage,
  endPoint,
  dataArray
) => {
  const fleetTypesApi = `${BASE_URL}${endPoint}`;
  let newFleetMakesData = [];
  let apiData = [];
  if (token)
    axios
      .get(fleetTypesApi, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        //console.log(response);
        if (dataArray) {
          apiData = response.data[dataArray];
        } else {
          apiData = response.data;
        }
        // console.log(apiData);
        apiData?.map((item) => {
          newFleetMakesData.push({
            id: item.id,
            ...item,
          });
        });

        setDataState((prev) => {
          return {
            data: newFleetMakesData,
            isDataNeeded: prev.isDataNeeded,
          };
        });
      })
      .catch((error) => {
        console.log(error);
        if (error.response) {
          setErrorMessage(error.response.data.message);
        } else {
          setErrorMessage(error.message);
        }
      });
};

export const getDetailFunc = (
  setDataState,
  setErrorMessage,
  endPoint,
  dataArray
) => {
  const fleetTypesApi = `${BASE_URL}${endPoint}`;
  let newFleetMakesData = [];
  let apiData;
    axios
      .get(fleetTypesApi)
      .then((response) => {
        console.log(response);
        if (dataArray) {
          apiData = response.data[dataArray];
          
        } else {
          apiData = response.data;
        }
         console.log(apiData);

        setDataState((prev) => {
          return {
            data: apiData,
            isDataNeeded: prev.isDataNeeded,
          };
        });
      })
      .catch((error) => {
        console.log(error);
        if (error.response) {
          setErrorMessage(error.response.data.message);
        } else {
          setErrorMessage(error.message);
        }
      });
};
