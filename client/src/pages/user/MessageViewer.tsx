import ProfileImage from "@/components/ProfileImage";
import { Link, useNavigate, useParams } from "react-router-dom";
import MessageInput from "./components/message/MessageInput";
import { useEffect, useRef, useState } from "react";
import apiClient from "@/apiClient";
import { useSocket } from "@/hooks/use-socket";
import MessageCard, { MessageType } from "./components/message/MessageCard";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Video } from "lucide-react";
import { useCall } from "@/hooks/use-call";

const MessageViewer: React.FC = () => {
  const socket = useSocket();
  const navigate = useNavigate();
  const callHandler = useCall();
  const myUsername = useSelector(
    (state: RootState) => state.auth.userData?.username
  );
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const { username } = useParams();
  const [conversationId, setConversationId] = useState<string>();
  const [messages, setMessages] = useState<MessageType[]>([]);

  useEffect(() => {
    apiClient
      .get(`/conversations/${username}/conversationId`)
      .then((response) => {
        const conversationId = response.data.conversationId;
        setConversationId(conversationId);
        apiClient.get(`/conversations/${conversationId}`).then((response) => {
          setMessages(response.data);
          scrollChatViewToBottom();
        });
      });
  }, [username]);

  useEffect(() => {
    const handleIncomingMessage = (newMessage: MessageType) => {
      if (newMessage.from === username) {
        setMessages((prevMessages) => [...prevMessages, newMessage]);
        scrollChatViewToBottom();
      }
    };

    const handleSendSuccessMessgae = (newMessage: MessageType) => {
      setMessages((prevMessages) =>
        prevMessages.map((message) => {
          if (
            message.status === "pending" &&
            message.message === newMessage.message &&
            message.type === newMessage.type
          ) {
            return newMessage;
          } else return message;
        })
      );
    };

    socket?.on("send-message", handleIncomingMessage);
    socket?.on("send-message-success", handleSendSuccessMessgae);

    return () => {
      socket?.off("send-message", handleIncomingMessage);
      socket?.off("send-message-success", handleSendSuccessMessgae);
    };
  }, [socket, username]);

  function scrollChatViewToBottom() {
    setTimeout(() => {
      if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop =
          chatContainerRef.current.scrollHeight;
      }
    }, 0);
  }

  const handleSendMessage = async (data: {
    message?: string;
    image?: string;
    type: "text" | "image";
  }) => {
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        ...data,
        _id: `self${Date.now()}`,
        status: "pending",
        createdAt: new Date().toString(),
      },
    ]);
    scrollChatViewToBottom();

    if (!conversationId) {
      const response = await apiClient.post("/conversations/create", {
        participants: username,
      });
      setConversationId(response.data.conversationId as string);
    }

    socket?.emit("send-message", username, data);
  };

  return (
    <div className="h-screen">
      <div className="sticky top-0 bg-secondary/75 border-b border-border w-full flex justify-between px-2 sm:px-4 py-2">
        <div className="flex gap-1 items-center">
          <div>
            <Button
              variant="ghost"
              className="sm:hidden aspect-square [&_svg]:size-5"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft size={60} />
            </Button>
          </div>
          <Link to={`/${username}`}>
            <ProfileImage className="w-10" />
          </Link>
          <Link to={`/${username}`}>
            <span className="font-bold">{username}</span>
          </Link>
        </div>

        <div className="flex gap-1 items-center [&_svg]:size-7">
          <Button
            variant="ghost"
            className="aspect-square p-1"
            onClick={() => callHandler?.callUser(username ?? "")}
          >
            <Video />
          </Button>
        </div>
      </div>

      <div
        className="h-[calc(100vh-7.1rem)] overflow-y-scroll no-scrollbar px-2 md:px-4"
        ref={chatContainerRef}
      >
        {messages.map((message, index) => (
          <MessageCard
            key={index}
            data={message}
            sender={message.status === "pending" || myUsername === message.from}
          />
        ))}
      </div>

      <MessageInput onSubmit={handleSendMessage} />
    </div>
  );
};

export default MessageViewer;
