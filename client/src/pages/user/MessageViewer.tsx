import ProfileImage from "@/components/ProfileImage";
import { Link, useParams } from "react-router-dom";
import MessageList from "./components/message/MessageList";
import MessageInput from "./components/message/MessageInput";

const MessageViewer: React.FC = () => {
  const { username } = useParams();

  return (
    <div className="h-screen">
      <div className="sticky top-0 bg-secondary/75 border-b border-border w-full flex px-4 py-2">
        <div className="flex gap-1 items-center">
          <Link to={`/${username}`}>
            <ProfileImage className="w-10" />
          </Link>
          <Link to={`/${username}`}>
            <span className="font-bold">{username}</span>
          </Link>
        </div>
      </div>
      <MessageList />
      <MessageInput />
    </div>
  );
};

export default MessageViewer;
