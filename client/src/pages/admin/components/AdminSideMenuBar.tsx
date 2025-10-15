import { useDispatch } from "react-redux";
import MenuButton from "../../../components/MenuButton";
import SideMenuBar from "../../../components/SideMenuBar";
import { logout } from "../../../redux/reducers/auth";
import ConfirmButton from "@/components/ConfirmButton";

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

      <ConfirmButton
      description="Do you really want to logout from admin portal"
        onSuccess={() => {
          dispatch(logout({ type: "admin" }));
        }}
      >
        <MenuButton to="/logout" text="Logout" />
      </ConfirmButton>
    </SideMenuBar>
  );
};

export default AdminSideMenuBar;
