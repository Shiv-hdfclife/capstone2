// services/auth.service.ts
import axiosInstance from "@/lib/api-client";

// login -> /api/auth/login
export const loginUser = async (username: string, password: string) => {
  try {
    const res = await axiosInstance.post("/auth/login", { username, password });
    return res.data;
  } catch (error: any) {
    throw {
      status: error.response?.status || 500,
      message: error.response?.data?.message || "Login failed",
    };
  }
};

// logout -> /api/auth/logout
export const logoutUser = async () => {
  try {
    const res = await axiosInstance.post("/auth/logout");
    return res.data;
  } catch (error: any) {
    throw {
      status: error.response?.status || 500,
      message: "Logout failed",
    };
  }
};

// fetch users -> /api/user
export const fetchAllUsers = async () => {
  try {
    const res = await axiosInstance.get("/user");
    return res.data;
  } catch (error: any) {
    throw {
      status: error.response?.status || 500,
      message: error.response?.data?.message || "Failed to fetch users",
    };
  }
};
