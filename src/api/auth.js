import API from "./api";

export const login = (data) =>
  API.post("api/admin/login", data);