import { createApiClient } from "./apiClientFactory";

const adminApiClient = createApiClient({
  baseURL: "/api/admin",
  accessTokenKey: "adminAccessToken",
  refreshTokenKey: "adminRefreshToken",
  authType: "admin",
});

export default adminApiClient;
