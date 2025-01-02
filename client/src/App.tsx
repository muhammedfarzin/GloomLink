import { Route, Routes } from "react-router-dom";
import { useSelector } from "react-redux";
import { type RootState } from "./redux/store";
import User from "./pages/user/User";
import Admin from "./pages/admin/Admin";
import UserLogin from "./pages/user/Login";
import AdminLogin from "./pages/admin/Login";
import Signup from "./pages/user/Signup";
import Home from "./pages/user/Home";

function App() {
  const background = useSelector(
    (state: RootState) => state.theme.colorTheme.background
  );
  return (
    <div className="h-screen w-screen overflow-y-scroll" style={{ backgroundColor: background }}>
      <Routes>
        <Route path="/login" element={<UserLogin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/admin/login" element={<AdminLogin />} />

        <Route path="/" element={<User />}>
          <Route index element={<Home />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
