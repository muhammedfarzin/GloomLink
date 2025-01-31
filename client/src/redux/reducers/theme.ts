import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export enum ColorTheme {
  dark = "dark",
  light = "light",
  blue = "blue",
  purple = "purple",
}

interface ThemeState {
  colorTheme: ColorTheme;
}

const defaultTheme: ThemeState = {
  colorTheme: ColorTheme.dark,
};

const initialState: ThemeState = defaultTheme;

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    setColorTheme: (state, action: PayloadAction<ThemeState["colorTheme"]>) => {
      state.colorTheme = action.payload;
    },
  },
});

export const { setColorTheme } = themeSlice.actions;

export default themeSlice.reducer;
