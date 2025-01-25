import apiClient from "@/apiClient";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import UserListCard, { type FollowUserData } from "./UserListCard";

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
  const { toast } = useToast();
  const [users, setUsers] = useState<FollowUserData[]>([]);

  useEffect(() => {
    apiClient
      .get(`/profile/${type}/${userId}`)
      .then((response) => setUsers(response.data))
      .catch((error) => {
        toast({
          description:
            error.response?.data?.message ||
            error.message ||
            "Something went wrong",
          variant: "destructive",
        });
      });
  }, []);

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

        <div className="w-full h-full mt-[-0.5rem] overflow-y-scroll no-scrollbar">
          {users.length ? (
            users.map((user) => (
              <UserListCard userData={user} handleChange={setUsers} />
            ))
          ) : (
            <div className="flex justify-center items-center h-full">There is no {type}</div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FollowDialogButton;
