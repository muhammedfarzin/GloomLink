import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import GloomLinkLogo from "../assets/images/GloomLink-Logo.svg";

interface SideMenuBarProps {
  children?: React.ReactNode;
  homePath?: string;
}

const SideMenuBar: React.FC<SideMenuBarProps> = ({
  children,
  homePath = "/",
}) => {
  const colorTheme = useSelector((state: RootState) => state.theme.colorTheme);

  return (
    <div
      className="w-1/5 max-w-[300px] h-screen py-6 px-4 overflow-y-scroll no-scrollbar fixed left-0 top-0"
      style={{
        backgroundColor: colorTheme.secondary,
      }}
    >
      <Link to={homePath}>
        <img src={GloomLinkLogo} alt="GloomLink" className="w-48 m-auto" />
      </Link>

      <div className="flex flex-col gap-2 mt-5" id="menus">
        {children}
      </div>
    </div>
  );
};

export default SideMenuBar;
