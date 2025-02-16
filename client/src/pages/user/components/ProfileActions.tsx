import DialogBox from "@/components/DialogBox";
import Button from "@/components/Button";
import type { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ColorThemeList from "./ColorThemeList";

interface ProfileActionsProps {
  username?: string;
  self?: boolean;
  isFollowing?: boolean;
  followersCount?: number;
  subscriptionAmount?: number;
  handleFollow?: (type: "follow" | "unfollow") => Promise<void>;
}

const ProfileActions: React.FC<ProfileActionsProps> = ({
  self = false,
  username,
  followersCount,
  isFollowing,
  subscriptionAmount,
  handleFollow,
}) => {
  const navigate = useNavigate();
  const myUsername = useSelector(
    (state: RootState) => state.auth.userData?.username
  );

  return (
    <div id="profile-actions" className="flex flex-col gap-2 mt-4">
      {self ? (
        <>
          <div className="flex gap-2">
            <Button
              className="w-full"
              onClick={() => navigate("/profile/edit")}
            >
              Edit Profile
            </Button>

            <DialogBox
              dialogElement={<ColorThemeList />}
              title="Color Themes"
              dialogClassName="h-auto"
            >
              <Button className="w-full">Switch Theme</Button>
            </DialogBox>
          </div>

          {(followersCount ?? 0) >= 5 && !subscriptionAmount ? (
            <div className="flex gap-2">
              <Button
                className="w-full"
                onClick={() => navigate("/subscription/enable")}
              >
                Enable Subscription
              </Button>
            </div>
          ) : null}
        </>
      ) : (
        <>
          <div className="flex gap-2">
            <Button
              className="w-full"
              onClick={() =>
                handleFollow?.(isFollowing ? "unfollow" : "follow")
              }
              disabled={username === myUsername}
            >
              {isFollowing ? "Unfollow" : "Follow"}
            </Button>
            <Button
              className="w-full"
              disabled={username === myUsername}
              onClick={() => navigate(`/messages/${username}`)}
            >
              Message
            </Button>
            {subscriptionAmount && (
              <Button className="w-full" disabled={username === myUsername}>
                Subscribe
              </Button>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ProfileActions;
