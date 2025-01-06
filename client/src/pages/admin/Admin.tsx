import { Outlet, useLocation, useNavigate } from "react-router-dom";
import AdminSideMenuBar from "./components/AdminSideMenuBar";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { logout } from "../../redux/reducers/auth";

const Admin: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const adminData = useSelector((state: RootState) => state.auth.adminData);
  const [selectedValue, setSelectedValue] = useState("home");

  useEffect(() => {
    const accessToken = localStorage.getItem("adminAccessToken");
    if (!adminData || !accessToken) {
      dispatch(logout({ type: "admin" }));
      navigate("/admin/login");
    }
  }, [adminData]);

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
