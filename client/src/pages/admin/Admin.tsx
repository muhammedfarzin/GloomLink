import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import SideMenuBar from "@/components/SideMenuBar";

import type { RootState } from "@/redux/store";

const Admin: React.FC = () => {
  const adminData = useSelector((state: RootState) => state.auth.adminData);

  return adminData ? (
    <>
      <SideMenuBar homePath="/admin" userType="admin" />
      <div className="w-4/5 ml-auto">
        <Outlet />
      </div>
    </>
  ) : (
    <Navigate to="/admin/login" />
  );
};

export default Admin;
