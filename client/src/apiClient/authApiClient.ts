import { createApiClient } from "./apiClientFactory";

const authApiClient = createApiClient({
  baseURL: "/api/auth",
  accessTokenKey: "accessToken",
});

export default authApiClient;
