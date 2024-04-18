import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

export const $api = axios.create({
  withCredentials: true,
  baseURL: API_BASE_URL,
});

$api.interceptors.request.use((cfg) => {
  const accessToken = localStorage.getItem("accessToken");

  if (accessToken && cfg.headers) {
    cfg.headers.Authorization = `Bearer ${accessToken}`;
  }

  return cfg;
});
