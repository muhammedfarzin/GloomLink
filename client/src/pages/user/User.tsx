import { Outlet, useLocation } from "react-router-dom";
import UserSideMenuBar from "../../components/UserSideMenuBar";
import { useEffect, useState } from "react";
import ChatList from "../../components/ChatList";

const User = () => {
  const location = useLocation();
  const [selectedValue, setSelectedValue] = useState("home");

  useEffect(() => {
    const pathSegments = location.pathname.split("/");
    setSelectedValue(pathSegments[1] === "" ? "home" : pathSegments[1]);
  }, [location]);

  return (
    <div>
      <UserSideMenuBar selected={selectedValue} />
      <div className="w-3/5 max-w-[840px] px-5 m-auto">
      <Outlet />
    </div>
    </div>
  );
};

export default User;
