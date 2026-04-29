import axios from "axios";

const API = axios.create({
  baseURL: "https://api.ma-quality-products.online",
});

// ✅ INTERCEPTOR
API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      // session expired
      localStorage.removeItem("token");

      alert("Session expired. Please login again.");

      window.location.href = "/";
    }

    return Promise.reject(err);
  }
);

export default API;