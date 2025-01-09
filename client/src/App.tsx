import { Route, Routes } from "react-router-dom";
import { useSelector } from "react-redux";
import { type RootState } from "./redux/store";
import User from "./pages/user/User";
import Admin from "./pages/admin/Admin";
import UserLogin from "./pages/user/Login";
import AdminLogin from "./pages/admin/AdminLogin";
import Signup from "./pages/user/Signup";
import Home from "./pages/user/Home";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUserLists from "./pages/admin/AdminUserLists";
import OtpVerification from "./pages/user/OtpVerification";
import Profile from "./pages/user/Profile";
import CreatePost from "./pages/user/CreatePost";

function App() {
  const { background, text: textColor } = useSelector(
    (state: RootState) => state.theme.colorTheme
  );

  return (
    <div
      className="h-screen w-screen overflow-y-scroll no-scrollbar"
      style={{ backgroundColor: background, color: textColor }}
    >
      <Routes>
        <Route path="login" element={<UserLogin />} />
        <Route path="signup" element={<Signup />} />
        <Route path="signup/verify" element={<OtpVerification />} />
        <Route path="admin/login" element={<AdminLogin />} />

        <Route path="" element={<User />}>
          <Route index element={<Home />} />
          <Route path="profile" element={<Profile />} />
          <Route path="create-post" element={<CreatePost />} />
        </Route>

        <Route path="admin" element={<Admin />}>
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<AdminUserLists />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
