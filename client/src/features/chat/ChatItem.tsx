import { useParams } from "react-router-dom";
import ProfileImage from "../profile/ProfileImage";
import { cn } from "@/lib/utils";

interface ChatItemProps {
  username: string;
  unread?: number;
  online?: boolean;
  image?: string;
  onClick?: () => void;
}

const ChatItem: React.FC<ChatItemProps> = ({
  username,
  unread,
  online,
  image,
  onClick,
}) => {
  const { username: currentUsername } = useParams();

  return (
    <div
      className={cn(
        "flex items-center py-2 px-3 text-foreground rounded-2xl cursor-pointer",
        currentUsername === username &&
          /^\/messages\/[^/]+\/?$/.test(location.pathname)
          ? "bg-selection"
          : "bg-primary hover:bg-primary/75",
      )}
      onClick={onClick}
    >
      <ProfileImage
        profileImage={image}
        isOnline={online}
        className="!max-w-12"
      />

      <span className="text-base w-full font-bold overflow-x-clip">
        {username}
      </span>

      {unread ? (
        <span className="text-xs font-bold p-1 rounded-full bg-background w-5 h-5 flex items-center justify-center">
          {unread}
        </span>
      ) : null}
    </div>
  );
};

export default ChatItem;
