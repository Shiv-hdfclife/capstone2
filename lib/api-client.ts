// lib/api-client.ts
"use client";

import axios from "axios";

const axiosInstance = axios.create({
  // baseURL: "/api", // Now talks to BFF, not raw backend
  // baseURL: "http://10.141.198.31:8081", // Now talks to BFF, not raw backend
  // baseURL: "http://10.141.198.200:8083", // Now talks to BFF, not raw backend
  // baseURL: "http://192.168.254.77:8089", // Now talks to BFF, not raw backend
  baseURL: "http://192.168.254.74:8089", // Now talks to BFF, not raw backend
  headers: {
    "Content-Type": "application/json",
  },
});

// Function to get cookies from document.cookie
function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;

  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop()?.split(';').shift() || null;
  }
  return null;
}

// Request interceptor to add tokens to headers
axiosInstance.interceptors.request.use(
  (config) => {
    // For client-side requests, we need to get tokens from cookies via API call
    // Since HTTP-only cookies can't be accessed directly from JavaScript

    // We'll handle this differently - by making requests through BFF
    // or by creating a token endpoint that reads cookies server-side

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Handle token refresh or redirect to login
      if (typeof window !== "undefined") {
        // Try to refresh token first
        try {
          const refreshResponse = await fetch('/api/auth/refresh', {
            method: 'POST',
            credentials: 'include', // Include cookies
          });

          if (refreshResponse.ok) {
            // Retry the original request
            return axiosInstance.request(error.config);
          } else {
            // Refresh failed, redirect to login
            window.location.href = "/login";
          }
        } catch (refreshError) {
          window.location.href = "/login";
        }
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
