// src/axiosInstance.js

import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3000", // Replace with your API's base URL
  timeout: 10000, // Timeout after 10 seconds
  headers: {
    "Content-Type": "application/json",
    // Add any other default headers if needed
  },
});

// Example of adding request interceptors
axiosInstance.interceptors.request.use(
  (config) => {
    console.log("Trying to insert the token");
    // You can add tokens or modify the request config before sending it
    // Example: adding Authorization token
    const token = localStorage.getItem("token");
    if (token) {
      console.log("TOKEN FOUND");
      config.headers["authorization"] = `${token}`;
    }
    return config;
  },
  (error) => {
    console.log("Error with sending");
    return Promise.reject(error);
  }
);

// Example of adding response interceptors
axiosInstance.interceptors.response.use(
  (response) => {
    // You can modify the response data here
    return response;
  },
  (error) => {
    // Handle errors, e.g., redirect to login on 401
    if (error.response && error.response.status === 401) {
      // Redirect to login or refresh token logic
    }
    console.log("Error with receiving");
    return Promise.reject(error);
  }
);

export default axiosInstance;
