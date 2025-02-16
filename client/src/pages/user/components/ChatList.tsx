import { useEffect, useState } from "react";
import ChatItem from "./ChatItem";
import apiClient from "@/apiClient";
import { UserDataType } from "./UserListCard";
import { useSocket } from "@/hooks/use-socket";
import type { MessageType } from "./message/MessageCard";
import { useParams } from "react-router-dom";

export type ChatUserDataType = Omit<UserDataType, "isFollowing"> & {
  unread?: number;
};

const ChatList = () => {
  const socket = useSocket();
  const { username: selectedUsername } = useParams();
  const [chats, setChats] = useState<ChatUserDataType[]>([]);
  const [suggested, setSuggested] = useState<ChatUserDataType[]>([]);

  useEffect(() => {
    apiClient.get("/conversations/").then((response) => {
      setChats(response.data.conversations);
      setSuggested(response.data.suggested);
    });
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.on("send-message", handleIncomeMessage);
    return () => {
      socket.off("send-message", handleIncomeMessage);
    };
  }, [socket, location.pathname, chats, suggested, selectedUsername]);

  const handleIncomeMessage = async (newMessage: MessageType) => {
    let chat: ChatUserDataType | undefined = chats.find(
      (chat) => chat.username === newMessage.from
    );

    if (chat) {
      if (
        /^\/messages\/[^/]+\/?$/.test(location.pathname) &&
        selectedUsername === newMessage.from
      ) {
        chat.unread = 0;
      } else chat.unread = chat.unread ? chat.unread + 1 : 1;

      const remaining = chats.filter(
        (chat) => chat.username !== newMessage.from
      );
      return setChats([chat, ...remaining]);
    }

    setSuggested((prevState) => {
      chat = prevState.find((chat) => chat.username === newMessage.from);
      if (chat) {
        if (
          /^\/messages\/[^/]+\/?$/.test(location.pathname) &&
          selectedUsername === newMessage.from
        ) {
          chat.unread = 0;
        } else chat.unread = chat.unread ? chat.unread + 1 : 1;

        const remaining = prevState.filter(
          (chat) => chat.username !== newMessage.from
        );
        return [...remaining];
      } else return prevState;
    });

    if (chat) return setChats([chat, ...chats]);

    const response = await apiClient.get(`/profile/${newMessage.from}`);
    const { _id, username, firstname, lastname, image } = response.data;
    chat = { _id, username, firstname, lastname, image, unread: 1 };
    setChats([chat, ...chats]);
  };

  return (
    <div className="hidden lg:flex flex-col gap-3 w-1/5 max-w-[300px] h-screen bg-secondary text-foreground py-6 px-4 overflow-y-scroll no-scrollbar fixed right-0 top-0">
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
                  unread={chat.unread}
                  onClick={() => {
                    setChats((prevState) =>
                      prevState.map((chatState) => {
                        if (chatState._id === chat._id) {
                          chatState.unread = 0;
                        }
                        return chatState;
                      })
                    );
                  }}
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

export default ChatList;
