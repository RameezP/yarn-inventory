// src/services/api.js
import axios from "axios";

console.log("Loaded API URL =", process.env.REACT_APP_API_URL);

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL,  // MUST be replaced at build time
});

// Add JWT token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default API;
