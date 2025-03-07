import axios from "axios";
import { BASE_URL } from "../utils/base";

const MainAxios = axios.create({
  baseURL: BASE_URL,
  timeout: 60000,
  withCredentials: false,
});

// Request interceptor to add authorization token
MainAxios.interceptors.request.use(
  (config) => {
    const token = JSON.parse(sessionStorage.getItem("__auth_details") as string).token; // Or wherever you store your token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default MainAxios;