import { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import SideMenuBar from "@/components/SideMenuBar";
import ChatList from "@/features/chat/ChatList";
import IncomeCallListener from "@/features/call/IncomeCallListener";
import { logout } from "@/redux/reducers/auth";
import XsTopMenuBar from "@/components/XsTopMenuBar";
import { ScreenSizeEnum, useScreenSize } from "@/hooks/useScreenSize";
import type { RootState } from "@/redux/store";

const User = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const userData = useSelector((state: RootState) => state.auth.userData);
  const { screenGreaterThan, screenLessThan } = useScreenSize();
  const [userAuthenticated, setUserAuthenticated] = useState(false);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken || !userData) {
      navigate("/login");
    } else if (userData.status === "blocked") {
      dispatch(logout({ type: "user" }));
    } else if (userData.status === "not-verified") {
      navigate("/signup/verify");
    } else setUserAuthenticated(true);
  }, [userData]);

  return userAuthenticated ? (
    <>
      {screenGreaterThan(ScreenSizeEnum.xs) && <SideMenuBar userType="user" />}

      {!/^\/messages\/[^/]+\/?$/.test(location.pathname) &&
      screenLessThan(ScreenSizeEnum.sm) ? (
        <XsTopMenuBar />
      ) : null}

      <div className="w-full sm:w-2/3 md:w-3/4 lg:w-3/5 max-w-[840px] ml-auto lg:m-auto">
        <Outlet />
        <IncomeCallListener />
      </div>

      {screenGreaterThan(ScreenSizeEnum.md) && (
        <div className="flex flex-col gap-3 w-1/5 max-w-[300px] h-screen bg-secondary text-foreground py-6 px-4 overflow-y-scroll no-scrollbar fixed right-0 top-0">
          <ChatList />
        </div>
      )}
    </>
  ) : null;
};

export default User;
