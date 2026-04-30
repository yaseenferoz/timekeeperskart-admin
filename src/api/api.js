import axios from "axios";

const API = axios.create({
  baseURL: "https://api.ma-quality-products.online",
});

// ✅ ADD REQUEST INTERCEPTOR (THIS IS MISSING)
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ RESPONSE INTERCEPTOR
API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("token");

      alert("Session expired. Please login again.");

      window.location.href = "/";
    }

    return Promise.reject(err);
  }
);

export default API;