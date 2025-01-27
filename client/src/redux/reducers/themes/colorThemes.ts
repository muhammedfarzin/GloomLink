export interface ColorThemeState {
  primary: string;
  secondary: string;
  background: string;
  text: "#ffffff" | "#000000";
  selection: string;
  border: string;
  danger: string;
  formBackground: string;
}

interface colorThemesState {
  [keys: string]: ColorThemeState;
  dark: ColorThemeState;
  light: ColorThemeState;
}

export const colorThemes: colorThemesState = {
  dark: {
    primary: "#353535",
    secondary: "#212121",
    background: "#1f1f1f",
    text: "#ffffff",
    selection: "#191919",
    border: "#2f2f2f",
    danger: "#991b1b",
    formBackground: "#505050",
  },
  light: {
    primary: "#f0f0f0",
    secondary: "#e0e0e0",
    background: "#d9d9d9",
    text: "#000000",
    selection: "#c9c9c9",
    border: "#b9b9b9",
    danger: "#ff4d4f",
    formBackground: "#b0b0b0",
  },
  blue: {
    primary: "#2c81ff",
    secondary: "#97c1ff",
    background: "#d9d9d9",
    text: "#000000",
    selection: "#6ba8ff",
    border: "#99c3ff",
    danger: "#dc3545",
    formBackground: "#8eabd6",
  },
  purple: {
    primary: "#9d68ff",
    secondary: "#d3b8ff",
    background: "#d9d9d9",
    text: "#000000",
    selection: "#b4a2d4",
    border: "#c7a1ff",
    danger: "#dc3545",
    formBackground: "#d0b6ff",
  },
};
