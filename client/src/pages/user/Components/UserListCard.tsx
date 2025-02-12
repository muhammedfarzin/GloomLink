import apiClient from "@/apiClient";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import ProfileImage from "@/components/ProfileImage";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import { Button } from "@/components/ui/button";
import type { SearchResultType } from "../Search";

export interface UserDataType {
  _id: string;
  username: string;
  firstname: string;
  lastname: string;
  image?: string;
  isFollowing?: boolean;
}

interface UserListCardProps {
  userData: UserDataType;
  className?: string;
  handleChange?:
    | React.Dispatch<React.SetStateAction<UserDataType[]>>
    | React.Dispatch<React.SetStateAction<SearchResultType[]>>;
}

const UserListCard: React.FC<UserListCardProps> = ({
  userData: { isFollowing = false, ...userData },
  className,
  handleChange,
}) => {
  const myUserId = useSelector((state: RootState) => state.auth.userData?._id);
  const { toast } = useToast();

  const handleFollowUser = async (type: "follow" | "unfollow") => {
    const userId = userData._id;
    function toggleFollowStatus() {
      handleChange?.((prevState: any[]) =>
        prevState.map((user) => {
          if (user._id === userId && (!user.type || user.type === "user")) {
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
      className={`flex items-center justify-between bg-[#6b728033] p-2 rounded-lg ${className}`}
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
          onClick={() => handleFollowUser(isFollowing ? "unfollow" : "follow")}
        >
          {isFollowing ? "Unfollow" : "Follow"}
        </Button>
      ) : null}
    </div>
  );
};

export default UserListCard;
