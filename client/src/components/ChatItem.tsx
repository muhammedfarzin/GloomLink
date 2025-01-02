import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import ProfileImage from "./ProfileImage";

interface ChatItemProps {
  username: string;
  unread?: number;
  online?: boolean;
}

const ChatItem: React.FC<ChatItemProps> = ({ username, unread, online }) => {
  const colorTheme = useSelector((state: RootState) => state.theme.colorTheme);
  return (
    <div
      className="flex items-center py-2 px-3 rounded-2xl cursor-pointer"
      style={{
        backgroundColor: colorTheme.primary,
        color: colorTheme.text,
      }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.backgroundColor = colorTheme.primary + "bb")
      }
      onMouseLeave={(e) =>
        (e.currentTarget.style.backgroundColor = colorTheme.primary)
      }
    >
      <ProfileImage isOnline={online} />

      <span className="text-base w-full font-bold">{username}</span>

      {unread ? (
        <span
          className="text-xs font-bold p-1 rounded-full w-5 h-5 flex items-center justify-center"
          style={{ backgroundColor: colorTheme.background }}
        >
          {unread}
        </span>
      ) : null}
    </div>
  );
};

export default ChatItem;
