import MenuButton from "../../../components/MenuButton";
import SideMenuBar from "../../../components/SideMenuBar";

interface AdminSideMenuBarProps {
  selected?: string;
}

const AdminSideMenuBar: React.FC<AdminSideMenuBarProps> = ({selected}) => {
  return (
    <SideMenuBar homePath="/admin">
      <MenuButton to="/admin" text="Dashboard" selected={selected === 'admin'} />
      <MenuButton to="/admin/users" text="Users" selected={selected === 'users'} />
      <MenuButton to="/admin/posts" text="Posts" selected={selected === 'posts'} />
      <MenuButton to="/admin/subscriptions" text="Subscriptions" selected={selected === 'subscriptions'} />
    </SideMenuBar>
  );
};

export default AdminSideMenuBar;
