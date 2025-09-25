import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import UsersList from "@/components/UsersList";

interface FollowDialogButtonProps {
  userId: string;
  followCount: number;
  type: "followers" | "following";
}

const FollowDialogButton: React.FC<FollowDialogButtonProps> = ({
  userId,
  followCount,
  type,
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="flex flex-col justify-center text-center cursor-pointer">
          <span className="text-xl font-bold">{followCount}</span>
          <span className="text-sm font-light capitalize">{type}</span>
        </div>
      </DialogTrigger>

      <DialogContent className="flex flex-col w-full md:w-80 h-full md:max-h-[80vh] p-4">
        <DialogHeader>
          <DialogTitle className="capitalize">{type}</DialogTitle>
        </DialogHeader>

        <UsersList apiUrl={`/profile/follow/${userId}/${type}`} title={type} />
      </DialogContent>
    </Dialog>
  );
};

export default FollowDialogButton;
