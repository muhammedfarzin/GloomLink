import { Navigate, Outlet, useLocation } from "react-router-dom";
import AdminSideMenuBar from "./components/AdminSideMenuBar";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

const Admin: React.FC = () => {
  const location = useLocation();
  const adminData = useSelector((state: RootState) => state.auth.adminData);
  const [selectedValue, setSelectedValue] = useState("home");

  useEffect(() => {
    const selected = location.pathname.split("/").pop();
    setSelectedValue(selected || "home");
  }, [location]);

  return adminData ? (
    <>
      <AdminSideMenuBar selected={selectedValue} />
      <div className="w-4/5 ml-auto">
        <Outlet />
      </div>
    </>
  ) : (
    <Navigate to="/admin/login" />
  );
};

export default Admin;
