import ProfileImage from "@/components/ProfileImage";
import { Button } from "@/components/ui/button";
import { Phone } from "lucide-react";

interface IncomeCallCardType {
  username: string;
  onAccept?: () => void;
  onCancel?: () => void;
}

const IncomeCallCard: React.FC<IncomeCallCardType> = ({
  username,
  onAccept,
  onCancel,
}) => {
  return (
    <>
      <div className="flex flex-col justify-around items-center h-full">
        <div className="flex flex-col items-center gap-1 w-full">
          <ProfileImage />
          <span className="text-xl font-bold">{username}</span>
        </div>

        <div className="flex justify-around [&_svg]:size-6 w-full">
          <Button
            variant="destructive"
            className="rounded-full aspect-square w-16 max-w-[20%] h-full hover:border border-border"
            onClick={onCancel}
          >
            <Phone className="rotate-[135deg]" />
          </Button>

          <Button
            className="rounded-full aspect-square w-16 max-w-[20%] h-full bg-primary hover:border border-border text-foreground"
            onClick={onAccept}
          >
            <Phone />
          </Button>
        </div>
      </div>
    </>
  );
};

export default IncomeCallCard;
