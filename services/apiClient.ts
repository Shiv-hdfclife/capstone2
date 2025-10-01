"use client";
 
import axios from "axios";
 
const axiosInstance = axios.create({
  baseURL: "http://192.168.254.77:8088", 
//   headers: {
//     "Content-Type": "application/json",
//   },
});
 
 
 
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Optional: handle expired session
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);
 
export default axiosInstance;
 