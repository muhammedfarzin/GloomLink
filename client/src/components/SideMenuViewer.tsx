import { Menu } from "lucide-react";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { useEffect, useState } from "react";

interface SideMenuViewerProps {
  children: React.ReactNode;
  className?: string;
}

const SideMenuViewer: React.FC<SideMenuViewerProps> = ({
  children,
  className,
}) => {
  const [show, setShow] = useState(false);
  const pathname = location.pathname;

  useEffect(() => setShow(false), [pathname]);

  return (
    <Sheet open={show} onOpenChange={(open) => setShow(open)}>
      <SheetTrigger>
        <Button
          variant="ghost"
          className="[&_svg]:size-5 rounded-full aspect-square border border-border p-1"
        >
          <Menu />
        </Button>
      </SheetTrigger>

      <SheetContent side="left" className={className}>
        {children}
      </SheetContent>
    </Sheet>
  );
};

export default SideMenuViewer;
