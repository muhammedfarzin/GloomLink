export type MessageType = {
  _id: string;
  message?: string;
  image?: string;
  type: "text" | "image";
  createdAt: string;
} & (
  | { from: string; status: "sent" | "seen" }
  | { from?: null; status: "pending" }
);

interface MessageCardProps {
  data: MessageType;
  sender: boolean;
}

const MessageCard: React.FC<MessageCardProps> = ({ data, sender }) => {
  return (
    <div
      className={`border border-border my-2 p-4 w-fit max-w-5/6 rounded-xl ${
        sender ? "bg-primary ml-auto" : "bg-secondary mr-auto"
      } ${data.status === "pending" ? "animate-pulse" : ""}`}
    >
      <span tabIndex={0} className="line-clamp-[10] focus:line-clamp-none">
        {data.message}
      </span>
    </div>
  );
};

export default MessageCard;
