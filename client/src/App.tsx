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
import SavedPost from "./pages/user/SavedPost";
import EditProfile from "./pages/user/EditProfile";
import AdminPostLists from "./pages/admin/AdminPostLists";
import Search from "./pages/user/Search";
import { useEffect } from "react";

function App() {
  const colorTheme = useSelector((state: RootState) => state.theme.colorTheme);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", colorTheme)
  }, [colorTheme]);

  return (
    <div
      className="h-screen w-screen bg-background text-foreground overflow-y-scroll no-scrollbar"
    >
      <Routes>
        <Route path="login" element={<UserLogin />} />
        <Route path="signup" element={<Signup />} />
        <Route path="signup/verify" element={<OtpVerification />} />
        <Route path="admin/login" element={<AdminLogin />} />

        <Route path="" element={<User />}>
          <Route index element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="profile" element={<Profile self />} />
          <Route path="profile/edit" element={<EditProfile />} />
          <Route path="create-post" element={<CreatePost />} />
          <Route path="saved-post" element={<SavedPost />} />
          <Route path=":username" element={<Profile />} />
          <Route path="edit-post/:postId" element={<CreatePost />} />
        </Route>

        <Route path="admin" element={<Admin />}>
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<AdminUserLists />} />
          <Route path="posts" element={<AdminPostLists />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
