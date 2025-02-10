import { useEffect, useState } from "react";
import type { ChatUserDataType } from "./components/ChatList";
import apiClient from "@/apiClient";
import ChatItem from "./components/ChatItem";

const Messages = () => {
  const [chats, setChats] = useState<ChatUserDataType[]>([]);
  const [suggested, setSuggested] = useState<ChatUserDataType[]>([]);

  useEffect(() => {
    apiClient.get("/conversations/").then((response) => {
      setChats(response.data.conversations);
      setSuggested(response.data.suggested);
    });
  }, []);

  return (
    <div className="flex flex-col gap-3 m-4">
      {/* Chat List */}
      {chats.length || (!chats.length && !suggested.length) ? (
        <div>
          <h2 className="text-xl font-bold">Chats</h2>

          <div className="flex flex-col gap-2 mt-2" id="chats">
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
        </div>
      ) : null}

      {/* Suggested Chats */}
      {suggested.length ? (
        <div>
          <h2 className="text-xl font-bold">Suggested</h2>

          <div className="flex flex-col gap-2 mt-2" id="suggested-chats">
            {suggested.map((chat) => (
              <ChatItem
                key={chat._id}
                username={chat.username}
                image={chat.image}
              />
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default Messages;
