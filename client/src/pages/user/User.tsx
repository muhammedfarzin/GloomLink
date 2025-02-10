import { Outlet, useLocation, useNavigate } from "react-router-dom";
import UserSideMenuBar from "./components/UserSideMenuBar";
import { useEffect, useState } from "react";
import ChatList from "./components/ChatList";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { logout } from "../../redux/reducers/auth";
import SocketProvider from "@/context/SocketContext";
import XsTopMenuBar from "./XsTopMenuBar";

const User = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const userData = useSelector((state: RootState) => state.auth.userData);
  const [selectedValue, setSelectedValue] = useState("home");

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken || !userData) {
      navigate("/login");
    } else if (userData.status === "blocked") {
      dispatch(logout({ type: "user" }));
    } else if (userData.status === "not-verified") {
      navigate("/signup/verify");
    }
  }, [userData]);

  useEffect(() => {
    const selected = location.pathname.split("/").pop();
    setSelectedValue(selected || "home");
  }, [location]);

  return (
    <SocketProvider>
      <UserSideMenuBar selected={selectedValue} />
      {!/^\/messages\/[^/]+\/?$/.test(location.pathname) ? <XsTopMenuBar /> : null}

      <div className="w-full sm:w-2/3 md:w-3/4 lg:w-3/5 max-w-[840px] ml-auto lg:m-auto">
        <Outlet />
      </div>
      <ChatList />
    </SocketProvider>
  );
};

export default User;
