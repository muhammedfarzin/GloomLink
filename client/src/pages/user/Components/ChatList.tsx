import ChatItem from "./ChatItem";

const ChatList = () => {
  return (
    <div className="w-1/5 max-w-[300px] h-screen bg-secondary text-foreground py-6 px-4 overflow-y-scroll no-scrollbar fixed right-0 top-0">
      <h1 className="text-xl font-bold">Chats</h1>

      <div className="flex flex-col gap-2 mt-5" id="chats">
        <ChatItem username="user_name" online />
        <ChatItem username="__rahul" unread={3} />
        <ChatItem username="_nikHil" online />
        <ChatItem username="mithun._2" />
      </div>
    </div>
  );
};

export default ChatList;
