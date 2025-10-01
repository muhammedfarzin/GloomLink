import { useCallback, useEffect, useState } from "react";
import ChatItem from "./ChatItem";
import apiClient from "@/apiClient";
import { useSocket } from "@/hooks/use-socket";
import type { MessageType } from "@/types/message-type";
import { useParams } from "react-router-dom";
import { ChatUserDataType } from "@/components/types/user-data-types";

const ChatList = () => {
  const socket = useSocket();
  const { username: selectedUsername } = useParams();
  const [chats, setChats] = useState<ChatUserDataType[]>([]);
  const [suggested, setSuggested] = useState<ChatUserDataType[]>([]);

  const handleIncomeMessage = useCallback(
    async (newMessage: MessageType) => {
      let chat: ChatUserDataType | undefined = chats.find(
        (chat) => chat.username === newMessage.from
      );

      if (chat) {
        const newChat = { ...chat };

        if (
          /^\/messages\/[^/]+\/?$/.test(location.pathname) &&
          selectedUsername === newMessage.from
        ) {
          newChat.unread = 0;
        } else newChat.unread = (newChat.unread || 0) + 1;

        const remaining = chats.filter(
          (chat) => chat.username !== newMessage.from
        );
        return setChats([newChat, ...remaining]);
      }
    },
    [chats, setChats]
  );

  const handleNewConversation = useCallback(
    (conversation: ChatUserDataType) => {
      const isExist = chats.find((chat) => chat._id === conversation._id);
      if (isExist) return;

      setChats((prevState) => [conversation, ...prevState]);
      setSuggested((prevState) =>
        prevState.filter((chat) => chat._id !== conversation._id)
      );
    },
    [chats, setChats, setSuggested]
  );

  useEffect(() => {
    apiClient.get("/conversations/").then((response) => {
      setChats(response.data.conversations);
      setSuggested(response.data.suggested);
    });
  }, []);

  useEffect(() => {
    if (/^\/messages\/([^\/]+)\/?$/.test(location.pathname)) {
      setChats((prevState) =>
        prevState.map((chat) => {
          if (chat.username === selectedUsername) {
            chat.unread = 0;
          }
          return chat;
        })
      );
    }
  }, [location.pathname]);

  useEffect(() => {
    if (!socket) return;

    socket.on("send-message", handleIncomeMessage);
    socket.on("new-conversation", handleNewConversation);
    return () => {
      socket.off("send-message", handleIncomeMessage);
      socket.off("new-conversation", handleNewConversation);
    };
  }, [socket, handleIncomeMessage, handleNewConversation]);

  return (
    <>
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
    </>
  );
};

export default ChatList;
