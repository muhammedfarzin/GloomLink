import axios, { AxiosError } from "axios";
import store from "./redux/store";
import { logout } from "./redux/reducers/auth";

const apiClient = axios.create({
  baseURL: "/api/user",
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) return store.dispatch(logout({ type: "user" }));
        const response = await axios.post("/api/user/auth/refresh", {
          token: refreshToken,
        });
        const newAccessToken = response.data.tokens.accessToken;
        const newRefreshToken = response.data.tokens.refreshToken;
        localStorage.setItem("accessToken", newAccessToken);
        localStorage.setItem("refreshToken", newRefreshToken);
        apiClient.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${newAccessToken}`;
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        return apiClient(originalRequest);
      } catch (responseError: any) {
        if (
          responseError.response?.data?.message === "Refresh token is required."
        ) {
          store.dispatch(logout({ type: "user" }));
          return Promise.reject(
            new AxiosError(
              "Your session session has been expired",
              responseError.status
            )
          );
        }
        return Promise.reject(responseError);
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
