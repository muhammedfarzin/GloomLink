import { Link, useNavigate } from "react-router-dom";
import GloomLinkLogo from "@/assets/images/GloomLink-Logo.svg";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import SideMenuViewer from "@/components/SideMenuViewer";
import UserSideMenuBar from "./components/UserSideMenuBar";

const XsTopMenuBar = () => {
  const navigate = useNavigate();
  const colorTheme = useSelector((state: RootState) => state.theme.colorTheme);

  return (
    <div className="flex sm:hidden justify-between items-center sticky top-0 bg-secondary border-b border-border p-2 z-50">
      <Link to={"/"}>
        <img
          src={GloomLinkLogo}
          alt="GloomLink"
          className="w-40 m-auto"
          style={{
            filter: `invert(${colorTheme === "dark" ? 0 : 1})`,
          }}
        />
      </Link>

      <div className="flex gap-2">
        <Button
          variant="ghost"
          className="[&_svg]:size-5 rounded-full aspect-square border border-border p-1"
          onClick={() => navigate("/messages")}
        >
          <MessageSquare />
        </Button>

        <SideMenuViewer className="p-0">
          <UserSideMenuBar className="" />
        </SideMenuViewer>
      </div>
    </div>
  );
};

export default XsTopMenuBar;
