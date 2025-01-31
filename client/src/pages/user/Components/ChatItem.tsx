import ProfileImage from "../../../components/ProfileImage";

interface ChatItemProps {
  username: string;
  unread?: number;
  online?: boolean;
}

const ChatItem: React.FC<ChatItemProps> = ({ username, unread, online }) => {
  return (
    <div className="flex items-center py-2 px-3 bg-primary text-foreground rounded-2xl cursor-pointer">
      <ProfileImage isOnline={online} />

      <span className="text-base w-full font-bold">{username}</span>

      {unread ? (
        <span className="text-xs font-bold p-1 rounded-full bg-background w-5 h-5 flex items-center justify-center">
          {unread}
        </span>
      ) : null}
    </div>
  );
};

export default ChatItem;
