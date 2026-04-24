import { useCallback, useEffect, useState } from "react";
import { apiClient } from "@/apiClient";
import { Conversation } from "@/types/user";
import { Button } from "@/components/ui/button";
import UserListCard from "@/features/profile/UserListCard";
import { useToaster } from "@/hooks/useToaster";
import { useSocket } from "@/hooks/use-socket";
import type { MessageType } from "@/types/message-type";

interface Props {
  data: {
    message?: string | undefined;
    image?: string | undefined;
    type: "image" | "text" | "post";
  };
}

const ShareList: React.FC<Props> = ({ data }) => {
  const socket = useSocket();
  const { toastError } = useToaster();
  const [chatList, setChatList] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [sentList, setSentList] = useState<
    Record<string, "shared" | "sharing">
  >({});

  const sharePost = useCallback(
    (conversationId: string) => {
      setSentList((prevState) => ({
        ...prevState,
        [conversationId]: "sharing",
      }));

      socket?.emit("send-message", conversationId, data);
    },
    [socket, data],
  );

  useEffect(() => {
    setLoading(true);
    apiClient
      .get("/conversations/")
      .then((response) => setChatList(response.data.conversations))
      .catch((error) => {
        toastError(error.message);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!socket) return;

    const handleShareSuccess = (newMessage: MessageType) => {
      setSentList((prevState) => {
        if (
          newMessage.type === data.type &&
          newMessage.message === data.message &&
          sentList[newMessage.conversationId]
        ) {
          return { ...prevState, [newMessage.conversationId]: "shared" };
        }

        return prevState;
      });
    };

    const handleShareFailed = (errMessage: string) => {
      toastError(errMessage);
    };

    socket.on("send-message-success", handleShareSuccess);
    socket.on("error-send-message", handleShareFailed);

    return () => {
      socket.off("send-message-success", handleShareSuccess);
    };
  }, [socket, sentList]);

  return (
    <div className="w-full h-full mt-[-0.5rem] overflow-y-scroll no-scrollbar">
      {chatList.length && !loading ? (
        chatList.map((chat) => (
          <UserListCard
            key={chat.conversationId}
            userData={{
              ...chat,
              userId: chat.participantId,
              fullname: `${chat.firstname} ${chat.lastname}`,
            }}
            className="my-2"
            actions={
              <Button
                className="h-7 capitalize"
                onClick={() => sharePost(chat.conversationId)}
                disabled={!!sentList[chat.conversationId]}
              >
                {sentList[chat.conversationId] ?? "Share"}
              </Button>
            }
          />
        ))
      ) : (
        <div className="flex justify-center items-center h-full">
          {loading || `There is no user in your sharelist`}
        </div>
      )}
    </div>
  );
};

export default ShareList;
