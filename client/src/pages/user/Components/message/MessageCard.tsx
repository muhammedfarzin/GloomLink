interface MessageCardProps {
  children: React.ReactNode;
  sender: boolean;
}

const MessageCard: React.FC<MessageCardProps> = ({ children, sender }) => {
  return (
    <div
      className={`border border-border my-2 p-4 w-fit max-w-5/6 rounded-xl ${
        sender ? "bg-primary ml-auto" : "bg-secondary mr-auto"
      }`}
    >
      <span tabIndex={0} className="line-clamp-[10] focus:line-clamp-none">
        {children}
      </span>
    </div>
  );
};

export default MessageCard;
