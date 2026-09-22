import axios from "axios";
import { getCookie } from "../utils/getCookie";

const backendBaseUrl = (
  import.meta.env.VITE_API_URL || "https://voxly-backend-sooty.vercel.app"
).replace(/\/$/, "");

export const BASE_URL = backendBaseUrl;

const client = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

client.interceptors.request.use((config) => {
  const token = getCookie("token");

  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default client;
