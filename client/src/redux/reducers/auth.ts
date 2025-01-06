import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface UserAuthState {
  _id: string;
  username: string;
  firstname: string;
  lastname: string;
  status: "not-verified" | "active" | "inactive" | "blocked";
  email: string;
  mobile: string;
  image?: string;
  gender?: "m" | "f";
  dob?: Date;
}

export interface AdminAuthState {
  username: string;
}

export interface TokensState {
  accessToken: string;
  refreshToken: string;
}

interface UserAuthWithTokenState {
  userData: UserAuthState;
  tokens: Omit<TokensState, "refreshToken"> &
    Partial<Pick<TokensState, "refreshToken">>;
}

interface AdminAuthWithTokenState {
  adminData: AdminAuthState;
  tokens: TokensState;
}

interface AuthState {
  userData: UserAuthState | null;
  adminData: AdminAuthState | null;
}

const initialState: AuthState = {
  userData: null,
  adminData: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthUser: (state, action: PayloadAction<UserAuthWithTokenState>) => {
      const { userData, tokens } = action.payload;

      localStorage.setItem("accessToken", tokens.accessToken);
      if (tokens.refreshToken)
        localStorage.setItem("refreshToken", tokens.refreshToken);

      state.userData = userData;
    },
    setAuthAdmin: (state, action: PayloadAction<AdminAuthWithTokenState>) => {
      const { adminData, tokens } = action.payload;

      localStorage.setItem("adminAccessToken", tokens.accessToken);
      localStorage.setItem("adminRefreshToken", tokens.refreshToken);

      state.adminData = adminData;
    },
    logout: (state, action: PayloadAction<{ type: "admin" | "user" }>) => {
      const type = action.payload.type;
      if (type === "user") {
        state.userData = null;
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
      } else if (type === "admin") {
        state.adminData = null;
        localStorage.removeItem("adminAccessToken");
        localStorage.removeItem("adminRefreshToken");
      }
    },
  },
});

export const { setAuthUser, setAuthAdmin, logout } = authSlice.actions;
export default authSlice.reducer;
