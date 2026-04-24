import { MessageType } from "@/types/message-type";
import PostMessage from "./PostMessage";
import { Link, useLocation } from "react-router-dom";

interface MessageCardProps {
  data: MessageType;
  sender: boolean;
}

const MessageCard: React.FC<MessageCardProps> = ({ data, sender }) => {
  const location = useLocation();
  const className = [
    "border border-border my-2 p-4 w-fit max-w-[85%] max-w-5/6 rounded-xl <transition-all></transition-all> duration-500",
    sender
      ? `${data.status === "seen" ? "bg-primary" : "bg-secondary"} ml-auto`
      : "bg-secondary mr-auto",
    data.status === "pending" ? "animate-pulse" : "",
    data.type === "post" ? `hover:bg-foreground/20` : "",
  ].join(" ");

  return (
    <div className={className}>
      {data.type === "post" ? (
        <Link
          to={`/post/${data.message}`}
          state={{ backgroundLocation: location }}
        >
          <PostMessage data={data} />
        </Link>
      ) : (
        <span tabIndex={0} className="line-clamp-[10] focus:line-clamp-none">
          {data.message}
        </span>
      )}
    </div>
  );
};

export default MessageCard;
