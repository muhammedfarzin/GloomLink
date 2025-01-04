import { Outlet, useLocation } from "react-router-dom";
import AdminSideMenuBar from "./components/AdminSideMenuBar";
import { useEffect, useState } from "react";

const Admin: React.FC = () => {
  const location = useLocation();
  const [selectedValue, setSelectedValue] = useState("home");

  useEffect(() => {
    const selected = location.pathname.split("/").pop();
    setSelectedValue(selected || "home");
  }, [location]);

  return (
    <>
      <AdminSideMenuBar selected={selectedValue} />
      <div className="w-4/5 ml-auto">
        <Outlet />
      </div>
    </>
  );
};

export default Admin;
