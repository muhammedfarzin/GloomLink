import MenuButton from "../../../components/MenuButton";
import SideMenuBar from "../../../components/SideMenuBar";
import HomeIcon from "../../../assets/icons/Home.svg";
import SearchIcon from "../../../assets/icons/Search.svg";
import AddSquareIcon from "../../../assets/icons/AddSquare.svg";
import SavedIcon from "../../../assets/icons/Saved.svg";
import ProfileCircleIcon from "../../../assets/icons/ProfileCircle.svg";
import LogoutIcon from "../../../assets/icons/Logout.svg";
import { useDispatch } from "react-redux";
import { logout } from "../../../redux/reducers/auth";

interface UserSideMenuBarProps {
  selected?: string;
}

const UserSideMenuBar: React.FC<UserSideMenuBarProps> = ({ selected }) => {
  const dispatch = useDispatch();

  return (
    <SideMenuBar>
      <MenuButton
        to="/"
        icon={HomeIcon}
        text="Home"
        selected={selected === "home"}
      />
      <MenuButton
        to="/search"
        icon={SearchIcon}
        text="Search"
        selected={selected === "search"}
      />
      <MenuButton
        to="/create-post"
        icon={AddSquareIcon}
        text="Create Posts"
        selected={selected === "create-post"}
      />
      <MenuButton
        to="/saved-post"
        icon={SavedIcon}
        text="Saved Posts"
        selected={selected === "saved-post"}
      />
      <MenuButton
        to="/profile"
        icon={ProfileCircleIcon}
        text="Profile"
        selected={selected === "profile"}
      />
      <MenuButton
        to="/logout"
        icon={LogoutIcon}
        text="Logout"
        onClick={(e) => {
          e.preventDefault();
          dispatch(logout({ type: "user" }));
        }}
      />
    </SideMenuBar>
  );
};

export default UserSideMenuBar;
