import axios from "axios";
import store from "./redux/store"; // Adjust the import according to your store file location
import { logout } from "./redux/reducers/auth"; // Adjust the import according to your actions file location

const BASE_URL = (import.meta.env.VITE_API_BASE_URL as string) + "/admin";

const adminApiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

adminApiClient.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("adminAccessToken");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

adminApiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem("adminRefreshToken");
        const response = await axios.post(BASE_URL + "/user/auth/refresh", {
          token: refreshToken,
        });
        const newAccessToken = response.data.accessToken;
        localStorage.setItem("accessToken", newAccessToken);
        adminApiClient.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${newAccessToken}`;
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        return adminApiClient(originalRequest);
      } catch (refreshError) {
        store.dispatch(logout({ type: "admin" }));
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default adminApiClient;
