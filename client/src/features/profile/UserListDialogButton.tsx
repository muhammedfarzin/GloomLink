import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import UsersList from "@/features/profile/UsersList";

interface Props {
  children: React.ReactNode;
  apiUrl: string;
  title: string;
}

const UserListDialogButton: React.FC<Props> = ({ children, apiUrl, title }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="flex flex-col w-full md:w-80 h-full md:max-h-[80vh] p-4">
        <DialogHeader>
          <DialogTitle className="capitalize">{title}</DialogTitle>
        </DialogHeader>

        <UsersList apiUrl={apiUrl} title={title} />
      </DialogContent>
    </Dialog>
  );
};

export default UserListDialogButton;
