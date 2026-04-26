import ProfileImage from "./ProfileImage";
import FollowDialogButton from "./FollowDialogButton";
import ProfileActions from "./ProfileActions";
import { apiClient } from "@/apiClient";
import { useToaster } from "@/hooks/useToaster";
import type { UserProfile } from "@/types/user";

interface Props {
  userData: UserProfile;
  self?: boolean;
  isFollowing?: boolean;
  onClickFollow?: (isFollowing: boolean) => void;
}

const UserOverviewCard: React.FC<Props> = ({
  userData,
  self = false,
  isFollowing = false,
  onClickFollow,
}) => {
  const { toastError } = useToaster();

  const handleClickFollow = async () => {
    try {
      onClickFollow?.(!isFollowing);
      await apiClient.post(`/profile/follow/${userData.userId}`);
    } catch (error: any) {
      onClickFollow?.(isFollowing);
      toastError(error.message);
    }
  };

  return (
    <div className="border border-border bg-secondary rounded-lg md:rounded-2xl mt-8 p-4 md:p-8">
      <div className="flex gap-4 md:gap-8 max-h-16 items-center">
        <ProfileImage profileImage={userData.imageUrl} className="min-w-12" />
        <div className="flex justify-between w-full">
          <div id="profile-deta" className="flex flex-col justify-center w-1/3">
            <span className="text-lg font-bold truncate">
              {userData.username}
            </span>
            <span className="text-sm font-light truncate">
              {userData.fullname}
            </span>
          </div>
          <div className="flex justify-around w-2/3">
            <FollowDialogButton
              userId={userData.userId}
              followCount={userData.followersCount}
              type="followers"
            />

            <FollowDialogButton
              userId={userData.userId}
              followCount={userData.followingCount}
              type="following"
            />
          </div>
        </div>
      </div>

      <ProfileActions
        username={userData.username}
        self={self}
        followersCount={userData.followersCount}
        isFollowing={isFollowing}
        onClickFollow={handleClickFollow}
        subscriptionAmount={userData.subscriptionAmount}
      />
    </div>
  );
};

export default UserOverviewCard;
