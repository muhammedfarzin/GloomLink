import ProfileImage from "@/components/ProfileImage";
import { Link, useNavigate, useParams } from "react-router-dom";
import MessageInput from "./components/message/MessageInput";
import { useEffect, useRef, useState } from "react";
import apiClient from "@/apiClient";
import { useSocket } from "@/hooks/use-socket";
import MessageCard from "./components/message/MessageCard";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Video } from "lucide-react";
import { useCall } from "@/hooks/use-call";
import { useToast } from "@/hooks/use-toast";
import { MessageType } from "@/types/message-type";

const MessageViewer: React.FC = () => {
  const socket = useSocket();
  const navigate = useNavigate();
  const callHandler = useCall();
  const myUsername = useSelector(
    (state: RootState) => state.auth.userData?.username
  );
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const messageInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { username } = useParams();
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [messageInput, setMessageInput] = useState<string>("");

  useEffect(() => {
    setMessages([]);
    setConversationId(null);

    if (!socket) return;

    apiClient
      .get(`/conversations/${username}/conversationId`)
      .then((response) => {
        const conversationId = response.data.conversationId;
        setConversationId(conversationId);
        apiClient.get(`/conversations/${conversationId}`).then((response) => {
          setMessages(response.data.messagesData);
          scrollChatViewToBottom();

          const unreadMessages = (response.data.messagesData as MessageType[])
            .filter(
              (chat) => chat.status !== "seen" && chat.from !== myUsername
            )
            .map((message) => ({ messageId: message._id, from: message.from }));

          socket.emit("message-seen", ...unreadMessages);
        });
      });
  }, [username, socket]);

  useEffect(() => {
    const handleIncomingMessage = (newMessage: MessageType) => {
      if (newMessage.from === username) {
        setMessages((prevMessages) => [...prevMessages, newMessage]);
        scrollChatViewToBottom();
        socket?.emit("message-seen", {
          messageId: newMessage._id,
          from: newMessage.from,
        });
      }
    };

    const handleSeenMessage = (seenMessage: MessageType) => {
      setMessages((prevState) =>
        prevState.map((message) => {
          if (message._id === seenMessage._id) message.status = "seen";
          return message;
        })
      );
    };

    const handleSendSuccessMessage = (newMessage: MessageType) => {
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

    const handleSendMessageError = (
      message: string,
      messageData: Partial<Pick<MessageType, "message" | "type">>
    ) => {
      if (messageInputRef.current) {
        messageInputRef.current.value = messageData.message ?? "";
      }
      setMessageInput(messageData.message ?? "");
      setMessages((prevMessages) =>
        prevMessages.filter((message) => {
          if (
            message.status === "pending" &&
            message.message === messageData.message &&
            message.type === messageData.type
          ) {
            return false;
          } else return true;
        })
      );

      toast({ description: message, variant: "destructive" });
    };

    socket?.on("send-message", handleIncomingMessage);
    socket?.on("message-seen", handleSeenMessage);
    socket?.on("send-message-success", handleSendSuccessMessage);
    socket?.on("error-send-message", handleSendMessageError);

    return () => {
      socket?.off("send-message", handleIncomingMessage);
      socket?.off("message-seen", handleSeenMessage);
      socket?.off("send-message-success", handleSendSuccessMessage);
      socket?.off("error-send-message", handleSendMessageError);
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

    let conversation = conversationId;
    if (!conversation) {
      const response = await apiClient.post("/conversations/create", {
        participants: username,
      });
      conversation = response.data.conversationId;
      setConversationId(response.data.conversationId as string);
    }

    socket?.emit("send-message", conversation, data);
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

      <MessageInput
        value={messageInput}
        onChange={setMessageInput}
        onSubmit={handleSendMessage}
      />
    </div>
  );
};

export default MessageViewer;
