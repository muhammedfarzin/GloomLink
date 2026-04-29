import { useEffect } from "react";
import { useSelector } from "react-redux";
import { type RootState } from "./redux/store";
import { AppRoutes } from "./routes/AppRoutes";

function App() {
  const colorTheme = useSelector((state: RootState) => state.theme.colorTheme);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", colorTheme);
  }, [colorTheme]);

  return (
    <div
      id="app-container"
      className="h-screen w-screen bg-background text-foreground overflow-y-scroll no-scrollbar"
    >
      <AppRoutes />
    </div>
  );
}

export default App;
