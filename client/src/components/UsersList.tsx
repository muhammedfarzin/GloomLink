import apiClient from "@/apiClient";
import { useToast } from "@/hooks/use-toast";
import UserListCard from "@/pages/user/components/UserListCard";
import { useEffect, useState } from "react";
import { UserDataType } from "./types/user-data-types";

interface UsersListProps {
  apiUrl: string;
  title: string;
}

const UsersList: React.FC<UsersListProps> = ({ apiUrl, title }) => {
  const { toast } = useToast();
  const [users, setUsers] = useState<UserDataType[]>([]);
  const [loading, setLoading] = useState<string | null>(null);

  useEffect(() => {
    setLoading("Fetching users...");
    apiClient
      .get(apiUrl)
      .then((response) => setUsers(response.data))
      .catch((error) => {
        toast({
          description:
            error.response?.data?.message ||
            error.message ||
            "Something went wrong",
          variant: "destructive",
        });
      })
      .finally(() => setLoading(null));
  }, []);

  return (
    <div className="w-full h-full mt-[-0.5rem] overflow-y-scroll no-scrollbar">
      {users.length && !loading ? (
        users.map((user) => (
          <UserListCard
            key={user._id}
            userData={user}
            className="my-2"
            handleChange={setUsers}
          />
        ))
      ) : (
        <div className="flex justify-center items-center h-full">
          {loading || `There is no ${title}`}
        </div>
      )}
    </div>
  );
};

export default UsersList;
