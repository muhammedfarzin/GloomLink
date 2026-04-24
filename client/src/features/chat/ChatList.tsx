import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ChatItem from "./ChatItem";
import { apiClient } from "@/apiClient";
import { useSocket } from "@/hooks/use-socket";
import type { MessageType } from "@/types/message-type";
import type { Conversation, CompactUser } from "@/types/user";

const ChatList = () => {
  const socket = useSocket();
  const navigate = useNavigate();
  const { username: selectedUsername } = useParams();
  const [chats, setChats] = useState<Conversation[]>([]);
  const [suggestedUsers, setSuggestedUsers] = useState<CompactUser[]>([]);

  const handleIncomeMessage = useCallback(
    async (newMessage: MessageType) => {
      const chat: Conversation | undefined = chats.find(
        (chat) => chat.username === newMessage.senderUsername,
      );

      if (chat) {
        const newChat = { ...chat };

        if (
          /^\/messages\/[^/]+\/?$/.test(location.pathname) &&
          selectedUsername === newMessage.senderUsername
        ) {
          newChat.unread = 0;
        } else newChat.unread = (newChat.unread || 0) + 1;

        const remaining = chats.filter(
          (chat) => chat.username !== newMessage.senderUsername,
        );
        return setChats([newChat, ...remaining]);
      }
    },
    [chats, setChats],
  );

  const handleNewConversation = useCallback(
    (conversation: Conversation) => {
      const isExist = chats.find(
        (chat) => chat.participantId === conversation.participantId,
      );
      if (isExist) return;

      setChats((prevState) => [conversation, ...prevState]);
      setSuggestedUsers((prevState) =>
        prevState.filter((chat) => chat.userId !== conversation.participantId),
      );
    },
    [chats, setChats, setSuggestedUsers],
  );

  useEffect(() => {
    apiClient.get("/conversations/").then((response) => {
      setChats(response.data.conversations);
      setSuggestedUsers(response.data.suggestedUsers);
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
        }),
      );
    }
  }, [location.pathname]);

  useEffect(() => {
    if (!socket) return;

    socket.on("incoming-message", handleIncomeMessage);
    socket.on("new-conversation", handleNewConversation);
    return () => {
      socket.off("incoming-message", handleIncomeMessage);
      socket.off("new-conversation", handleNewConversation);
    };
  }, [socket, handleIncomeMessage, handleNewConversation]);

  return (
    <>
      {/* Chat List */}
      {chats.length || (!chats.length && !suggestedUsers.length) ? (
        <div>
          <h2 className="text-xl font-bold">Chats</h2>

          <div className="flex flex-col gap-2 mt-2" id="chats">
            {chats.length ? (
              chats.map((chat) => (
                <ChatItem
                  key={chat.conversationId}
                  username={chat.username}
                  image={chat.imageUrl}
                  unread={chat.unread}
                  onClick={() => {
                    setChats((prevState) =>
                      prevState.map((chatState) => {
                        if (chatState.participantId === chat.participantId) {
                          chatState.unread = 0;
                        }
                        return chatState;
                      }),
                    );

                    navigate(`/messages/${chat.username}`);
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
      {suggestedUsers.length ? (
        <div>
          <h2 className="text-xl font-bold">Suggested</h2>

          <div className="flex flex-col gap-2 mt-2" id="suggested-chats">
            {suggestedUsers.map((chat) => (
              <ChatItem
                key={chat.userId}
                username={chat.username}
                image={chat.imageUrl}
                onClick={() => navigate(`/${chat.username}`)}
              />
            ))}
          </div>
        </div>
      ) : null}
    </>
  );
};

export default ChatList;
