import { Outlet, useLocation, useNavigate } from "react-router-dom";
import UserSideMenuBar from "./components/UserSideMenuBar";
import { useEffect, useState } from "react";
import ChatList from "./components/ChatList";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { logout } from "../../redux/reducers/auth";

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
