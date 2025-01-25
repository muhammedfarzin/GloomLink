import apiClient from "@/apiClient";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import ProfileImage from "@/components/ProfileImage";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import { Button } from "@/components/ui/button";

export interface FollowUserData {
  _id: string;
  username: string;
  firstname: string;
  lastname: string;
  image: string;
  isFollowing: boolean;
}

interface UserListCardProps {
  userData: FollowUserData;
  handleChange?: React.Dispatch<React.SetStateAction<FollowUserData[]>>;
}

const UserListCard: React.FC<UserListCardProps> = ({
  userData,
  handleChange,
}) => {
  const myUserId = useSelector((state: RootState) => state.auth.userData?._id);
  const { toast } = useToast();

  const handleFollowUser = async (
    userId: string,
    type: "follow" | "unfollow"
  ) => {
    function toggleFollowStatus() {
      handleChange?.((prevState) =>
        prevState.map((user) => {
          if (userData._id === userId) {
            user.isFollowing = !user.isFollowing;
          }
          return user;
        })
      );
    }

    try {
      toggleFollowStatus();
      await apiClient.post(`/profile/${type}/${userId}`);
    } catch (error: any) {
      toggleFollowStatus();
      toast({
        description:
          error.response?.data?.message ||
          error.message ||
          "Something went wrong",
        variant: "destructive",
      });
    }
  };

  return (
    <div
      key={userData._id}
      className="flex items-center justify-between bg-[#6b728033] my-2 p-2 rounded-lg"
    >
      <div className="flex items-center gap-1">
        <Link to={`/${userData.username}`}>
          <ProfileImage className="w-10" profileImage={userData.image} />
        </Link>
        <Link to={`/${userData.username}`}>
          <span className="text-sm font-bold line-clamp-1">
            {userData.username}
          </span>
        </Link>
      </div>
      {myUserId !== userData._id ? (
        <Button
          className="h-7"
          onClick={() =>
            handleFollowUser(
              userData._id,
              userData.isFollowing ? "unfollow" : "follow"
            )
          }
        >
          {userData.isFollowing ? "Unfollow" : "Follow"}
        </Button>
      ) : null}
    </div>
  );
};

export default UserListCard;
