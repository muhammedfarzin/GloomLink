import MessageCard from "./MessageCard";

const MessageList: React.FC = () => {
  return (
    <div className="h-[calc(100vh-7.1rem)] overflow-y-scroll no-scrollbar px-2 md:px-4">
      {Array.from({ length: 15 }).map((_, index) => (
        <MessageCard sender={!(index % 3)}>Message {index}</MessageCard>
      ))}
    </div>
  );
};

export default MessageList;
