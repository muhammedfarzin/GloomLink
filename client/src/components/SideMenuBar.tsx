import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import GloomLinkLogo from "../assets/images/GloomLink-Logo.svg";

interface SideMenuBarProps {
  children?: React.ReactNode;
  homePath?: string;
  className?: string;
}

const SideMenuBar: React.FC<SideMenuBarProps> = ({
  children,
  homePath = "/",
  className,
}) => {
  const colorTheme = useSelector((state: RootState) => state.theme.colorTheme);

  return (
    <div
      className={`bg-secondary h-screen py-6 px-4 overflow-y-scroll no-scrollbar ${
        className ??
        "hidden sm:block w-1/3 md:w-1/4 lg:w-1/5 max-w-[300px] fixed left-0 top-0"
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
        {children}
      </div>
    </div>
  );
};

export default SideMenuBar;
