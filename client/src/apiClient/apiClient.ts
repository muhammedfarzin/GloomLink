import { createApiClient } from "./apiClientFactory";

const apiClient = createApiClient({
  baseURL: "/api/user",
  accessTokenKey: "accessToken",
  refreshTokenKey: "refreshToken",
  authType: "user",
});

export default apiClient;
