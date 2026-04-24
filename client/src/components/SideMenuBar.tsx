import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { type LucideIcon, MessageSquare } from "lucide-react";
import GloomLinkLogo from "@/assets/images/GloomLink-Logo.svg";
import HomeIcon from "@/assets/icons/Home.svg";
import SearchIcon from "@/assets/icons/Search.svg";
import AddSquareIcon from "@/assets/icons/AddSquare.svg";
import SaveIcon from "@/assets/icons/Save.svg";
import ProfileCircleIcon from "@/assets/icons/ProfileCircle.svg";
import LogoutIcon from "@/assets/icons/Logout.svg";
import MenuButton from "./MenuButton";
import ConfirmButton from "./ConfirmButton";
import { logout } from "@/redux/reducers/auth";
import type { RootState } from "@/redux/store";

const SideMenuBar: React.FC<SideMenuBarProps> = ({
  children,
  homePath = "/",
  className,
  userType = "user",
}) => {
  const dispatch = useDispatch();
  const colorTheme = useSelector((state: RootState) => state.theme.colorTheme);
  const [currentPath, setCurrentPath] = useState("home");

  useEffect(() => {
    setCurrentPath(location.pathname);
  }, [location.pathname]);

  const userSideMenuItems: SideMenuItem[] = [
    { title: "Home", icon: HomeIcon, path: "/" },
    { title: "Search", icon: SearchIcon, path: "/search" },
    { title: "Messages", icon: MessageSquare, path: "/messages" },
    { title: "Create Posts", icon: AddSquareIcon, path: "/create-post" },
    { title: "Saved Posts", icon: SaveIcon, path: "/saved-post" },
    { title: "Profile", icon: ProfileCircleIcon, path: "/profile" },
  ];

  const adminSideMenuItems: SideMenuItem[] = [
    { title: "Dashboard", path: "/admin" },
    { title: "Users", path: "/admin/users" },
    { title: "Posts", path: "/admin/posts" },
  ];

  return (
    <div
      className={`bg-secondary h-screen py-6 px-4 overflow-y-scroll no-scrollbar ${
        className ??
        "block w-1/3 md:w-1/4 lg:w-1/5 max-w-[300px] fixed left-0 top-0"
      }`}
    >
      <Link to={homePath}>
        <img
          src={GloomLinkLogo}
          alt="GloomLink"
          className="w-48 m-auto"
          style={{
            filter: `invert(${colorTheme === "dark" ? 0 : 1})`,
          }}
        />
      </Link>

      <div className="flex flex-col gap-2 mt-5" id="menus">
        {(userType === "user" ? userSideMenuItems : adminSideMenuItems).map(
          (menu) => (
            <MenuButton
              to={menu.path}
              text={menu.title}
              icon={menu.icon}
              selected={currentPath === menu.path}
            />
          ),
        )}

        {children}

        <ConfirmButton
          description="Do you really want to logout"
          onSuccess={() => {
            dispatch(logout({ type: userType }));
          }}
        >
          <MenuButton
            to="/logout"
            text="Logout"
            icon={userType === "user" ? LogoutIcon : undefined}
          />
        </ConfirmButton>
      </div>
    </div>
  );
};

interface SideMenuBarProps {
  children?: React.ReactNode;
  homePath?: string;
  className?: string;
  userType?: "user" | "admin";
}

interface SideMenuItem {
  title: string;
  icon?: string | LucideIcon;
  path: string;
}

export default SideMenuBar;
