import { Navigate, Route, Routes } from "react-router-dom";
import UserLogin from "@/pages/user/Login";
import AdminLogin from "@/pages/admin/AdminLogin";
import Signup from "@/pages/user/Signup";
import OtpVerification from "@/pages/user/OtpVerification";

const AuthRoutes = () => {
  return (
    <Routes>
      <Route index element={<Navigate to="login" />} />
      <Route path="login" element={<UserLogin />} />
      <Route path="signup" element={<Signup />} />
      <Route path="signup/verify" element={<OtpVerification />} />
      <Route path="admin/login" element={<AdminLogin />} />
    </Routes>
  );
};

export default AuthRoutes;
