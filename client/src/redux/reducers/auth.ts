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

export interface TokensState {
  accessToken: string;
  refreshToken?: string;
}

interface UserAuthWithTokenState {
  userData: UserAuthState;
  tokens: TokensState;
}

interface AuthState {
  userData: UserAuthState | null;
}

const initialState: AuthState = {
  userData: null,
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
    logout: (state, action: PayloadAction<{ type: "admin" | "user" }>) => {
      const type = action.payload.type;
      if (type === "user") {
        state.userData = null;
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
      }
    },
  },
});

export const { setAuthUser, logout } = authSlice.actions;
export default authSlice.reducer;
