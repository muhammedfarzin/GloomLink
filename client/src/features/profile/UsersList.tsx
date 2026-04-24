import { useEffect, useState } from "react";
import { apiClient } from "@/apiClient";
import { useToaster } from "@/hooks/useToaster";
import UserListCard from "@/features/profile/UserListCard";
import type { CompactUser } from "@/types/user";

interface UsersListProps {
  apiUrl: string;
  title: string;
}

const UsersList: React.FC<UsersListProps> = ({ apiUrl, title }) => {
  const { toastError } = useToaster();
  const [users, setUsers] = useState<CompactUser[]>([]);
  const [loading, setLoading] = useState<string | null>(null);

  useEffect(() => {
    setLoading("Fetching users...");
    apiClient
      .get(apiUrl)
      .then((response) => setUsers(response.data.usersData))
      .catch((error) => toastError(error.message))
      .finally(() => setLoading(null));
  }, []);

  const updateUserData = (updatedData: CompactUser) => {
    setUsers((prevState) =>
      prevState.map((user) => {
        if (user.userId === updatedData.userId) {
          return updatedData;
        }
        return user;
      }),
    );
  };

  return (
    <div className="w-full h-full mt-[-0.5rem] overflow-y-scroll no-scrollbar">
      {users.length && !loading ? (
        users.map((user) => (
          <UserListCard
            key={user.userId}
            userData={user}
            className="my-2"
            handleChange={updateUserData}
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
