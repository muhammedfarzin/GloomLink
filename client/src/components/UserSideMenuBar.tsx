import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { Link } from "react-router-dom";
import GloomLinkLogo from "../assets/images/GloomLink-Logo.svg";
import HomeIcon from "../assets/icons/Home.svg";
import MenuButton from "./MenuButton";

interface UserSideMenuBarProps {
  selected?: string;
}

const UserSideMenuBar: React.FC<UserSideMenuBarProps> = ({ selected }) => {
  const colorTheme = useSelector((state: RootState) => state.theme.colorTheme);

  return (
    <div
      className="w-1/5 max-w-[300px] h-screen py-6 px-4 overflow-y-scroll no-scrollbar fixed left-0 top-0"
      style={{
        backgroundColor: colorTheme.secondary,
      }}
    >
      <Link to="/">
        <img src={GloomLinkLogo} alt="GloomLink" className="w-48 m-auto" />
      </Link>

      <div className="flex flex-col gap-1 mt-5" id="menus">
        <MenuButton
          to="/"
          icon={HomeIcon}
          text="Home"
          selected={selected === "home"}
        />
        <MenuButton
          to="/search"
          icon={HomeIcon}
          text="Search"
          selected={selected === "search"}
        />
        <MenuButton
          to="/create-post"
          icon={HomeIcon}
          text="Create Posts"
          selected={selected === "create-post"}
        />
        <MenuButton
          to="/saved-post"
          icon={HomeIcon}
          text="Saved Posts"
          selected={selected === "saved-post"}
        />
        <MenuButton
          to="/profile"
          icon={HomeIcon}
          text="Profile"
          selected={selected === "profile"}
        />
      </div>
    </div>
  );
};

export default UserSideMenuBar;
