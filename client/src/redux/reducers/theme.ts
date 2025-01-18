import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ColorThemeState {
  primary: string;
  secondary: string;
  background: string;
  text: string;
  selection: string;
  border: string;
  danger: string;
}

interface ThemeState {
  colorTheme: ColorThemeState;
}

const defaultTheme: ThemeState = {
  colorTheme: {
    primary: "#353535",
    secondary: "#212121",
    background: "#1f1f1f",
    text: "#ffffff",
    selection: "#191919",
    border: "#2f2f2f",
    danger: "#991b1b",
  },
};

const initialState: ThemeState = defaultTheme;

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    setColorTheme: (state, action: PayloadAction<ColorThemeState>) => {
      state.colorTheme = action.payload;
    },
  },
});

export const { setColorTheme } = themeSlice.actions;

export default themeSlice.reducer;
