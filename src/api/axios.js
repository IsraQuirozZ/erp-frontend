import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api", // AJUSTA a tu backend
  withCredentials: true,
});

export default api;
