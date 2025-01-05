import { Outlet, useLocation, useNavigate } from "react-router-dom";
import UserSideMenuBar from "./Components/UserSideMenuBar";
import { useEffect, useState } from "react";
import ChatList from "./Components/ChatList";

const User = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedValue, setSelectedValue] = useState("home");

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) navigate("/login");
  }, []);

  useEffect(() => {
    const selected = location.pathname.split("/").pop();
    setSelectedValue(selected || "home");
  }, [location]);

  return (
    <div>
      <UserSideMenuBar selected={selectedValue} />
      <div className="w-3/5 max-w-[840px] m-auto">
        <Outlet />
      </div>
      <ChatList />
    </div>
  );
};

export default User;
