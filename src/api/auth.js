import API from "./api";

export const login = (data) =>
  API.post("/admin/login", data);