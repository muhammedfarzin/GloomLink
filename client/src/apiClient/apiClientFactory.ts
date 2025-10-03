import axios, { AxiosError } from "axios";
import store from "../redux/store";
import { logout } from "../redux/reducers/auth";

interface ApiClientConfig {
  baseURL: string;
  accessTokenKey: string;
  refreshTokenKey: string;
  authType: "user" | "admin";
}

export const createApiClient = ({
  baseURL,
  accessTokenKey,
  refreshTokenKey,
  authType,
}: ApiClientConfig) => {
  const apiClient = axios.create({
    baseURL,
    headers: {
      "Content-Type": "application/json",
    },
  });

  apiClient.interceptors.request.use(
    (config) => {
      const accessToken = localStorage.getItem(accessTokenKey);
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
      error.message =
        error.response?.data?.message ||
        error.message ||
        "Something went wrong";

      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
          const refreshToken = localStorage.getItem(refreshTokenKey);
          if (!refreshToken) {
            store.dispatch(logout({ type: authType }));
            return Promise.reject(error);
          }
          const response = await axios.post(`/api/${authType}/auth/refresh`, {
            token: refreshToken,
          });
          const newAccessToken = response.data.tokens.accessToken;
          const newRefreshToken = response.data.tokens.refreshToken;
          localStorage.setItem(accessTokenKey, newAccessToken);
          localStorage.setItem(refreshTokenKey, newRefreshToken);
          apiClient.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${newAccessToken}`;
          originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
          return apiClient(originalRequest);
        } catch (responseError: any) {
          if (
            responseError.response?.data?.message ===
              "Refresh token is required." ||
            responseError.response?.data?.message ===
              "Invalid or expired refresh token."
          ) {
            store.dispatch(logout({ type: authType }));
            return Promise.reject(
              new AxiosError(
                "Your session session has expired",
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

  return apiClient;
};
