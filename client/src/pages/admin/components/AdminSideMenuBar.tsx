import { useDispatch } from "react-redux";
import MenuButton from "../../../components/MenuButton";
import SideMenuBar from "../../../components/SideMenuBar";
import { logout } from "../../../redux/reducers/auth";

interface AdminSideMenuBarProps {
  selected?: string;
}

const AdminSideMenuBar: React.FC<AdminSideMenuBarProps> = ({ selected }) => {
  const dispatch = useDispatch();

  return (
    <SideMenuBar homePath="/admin">
      <MenuButton
        to="/admin"
        text="Dashboard"
        selected={selected === "admin"}
      />
      <MenuButton
        to="/admin/users"
        text="Users"
        selected={selected === "users"}
      />
      <MenuButton
        to="/admin/posts"
        text="Posts"
        selected={selected === "posts"}
      />
      <MenuButton
        to="/admin/subscriptions"
        text="Subscriptions"
        selected={selected === "subscriptions"}
      />
      <MenuButton
        to="/logout"
        text="Logout"
        onClick={(e) => {
          e.preventDefault();
          dispatch(logout({ type: "admin" }));
        }}
      />
    </SideMenuBar>
  );
};

export default AdminSideMenuBar;
