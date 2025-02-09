import { useEffect, useState } from "react";
import ChatItem from "./ChatItem";
import apiClient from "@/apiClient";
import { UserDataType } from "./UserListCard";

type ChatUserDataType = Omit<UserDataType, "isFollowing">;

const ChatList = () => {
  const [chats, setChats] = useState<ChatUserDataType[]>([]);
  const [suggested, setSuggested] = useState<ChatUserDataType[]>([]);

  useEffect(() => {
    apiClient.get("/conversations/").then((response) => {
      setChats(response.data.conversations);
      setSuggested(response.data.suggested);
    });
  }, []);

  return (
    <div className="w-1/5 max-w-[300px] h-screen bg-secondary text-foreground py-6 px-4 overflow-y-scroll no-scrollbar fixed right-0 top-0">
      {/* Chat List */}
      {chats.length || (!chats.length && !suggested.length) ? (
        <>
          <h2 className="text-xl font-bold">Chats</h2>

          <div className="flex flex-col gap-2 mt-5" id="chats">
            {chats.length ? (
              chats.map((chat) => (
                <ChatItem
                  key={chat._id}
                  username={chat.username}
                  image={chat.image}
                />
              ))
            ) : (
              <span className="text-center text-sm">There is no chats</span>
            )}
          </div>
        </>
      ) : null}

      {/* Suggested Chats */}
      {suggested.length ? (
        <>
          <h2 className="text-xl font-bold">Suggested</h2>

          <div className="flex flex-col gap-2 mt-5" id="suggested-chats">
            {suggested.map((chat) => (
              <ChatItem
                key={chat._id}
                username={chat.username}
                image={chat.image}
              />
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
};

export default ChatList;
