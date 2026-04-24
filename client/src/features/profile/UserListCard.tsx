import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { apiClient } from "@/apiClient";
import type { RootState } from "@/redux/store";
import { useToaster } from "@/hooks/useToaster";
import ProfileImage from "@/features/profile/ProfileImage";
import { Button } from "@/components/ui/button";
import type { CompactUser } from "@/types/user";

interface UserListCardProps {
  userData: Omit<CompactUser, "type">;
  actions?: React.ReactNode;
  className?: string;
  handleChange?: (updatedData: CompactUser) => void;
}

const UserListCard: React.FC<UserListCardProps> = ({
  userData: { isFollowing = false, ...userData },
  className,
  actions,
  handleChange,
}) => {
  const myUserId = useSelector(
    (state: RootState) => state.auth.userData?.userId,
  );
  const { toastError } = useToaster();

  const handleFollowUser = async () => {
    const userId = userData.userId;
    function toggleFollowStatus() {
      handleChange?.({ ...userData, isFollowing: !isFollowing, type: "user" });
    }

    try {
      toggleFollowStatus();
      await apiClient.post(`/profile/follow/${userId}`);
    } catch (error: any) {
      toggleFollowStatus();
      toastError(error.message);
    }
  };

  return (
    <div
      key={userData.userId}
      className={`flex items-center justify-between bg-[#6b728033] p-2 rounded-lg ${className}`}
    >
      <div className="flex items-center gap-1">
        <Link to={`/${userData.username}`}>
          <ProfileImage className="w-10" profileImage={userData.imageUrl} />
        </Link>
        <Link to={`/${userData.username}`}>
          <span className="text-sm font-bold line-clamp-1">
            {userData.username}
          </span>
        </Link>
      </div>

      {actions ??
        (myUserId !== userData.userId && (
          <Button className="h-7" onClick={handleFollowUser}>
            {isFollowing ? "Unfollow" : "Follow"}
          </Button>
        ))}
    </div>
  );
};

export default UserListCard;
