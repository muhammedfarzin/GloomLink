import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { colorThemes, type ColorThemeState } from "./themes/colorThemes";

interface ThemeState {
  colorTheme: ColorThemeState;
}

const defaultTheme: ThemeState = {
  colorTheme: colorThemes.dark,
};

const initialState: ThemeState = defaultTheme;

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    setColorTheme: (state, action: PayloadAction<keyof typeof colorThemes>) => {
      state.colorTheme = colorThemes[action.payload];
    },
  },
});

export const { setColorTheme } = themeSlice.actions;

export default themeSlice.reducer;
