import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ColorThemeState {
  primary: string;
  secondary: string;
  background: string;
  text: string;
  selection: string;
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
  },
};

const loadState = (): ThemeState => {
  try {
    const serializedState = localStorage.getItem("theme");
    if (!serializedState) {
      return defaultTheme;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    return defaultTheme;
  }
};

const initialState: ThemeState = loadState();

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    setColorTheme: (state, action: PayloadAction<ColorThemeState>) => {
      state.colorTheme = action.payload;
      const serializedState = JSON.stringify(state);
      localStorage.setItem("theme", serializedState);
    }
  },
});

export const { setColorTheme } = themeSlice.actions;

export default themeSlice.reducer;
