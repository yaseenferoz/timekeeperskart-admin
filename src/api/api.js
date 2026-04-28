import axios from "axios";

const API = axios.create({
  baseURL: "https://api.ma-quality-products.online",
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

export default API;