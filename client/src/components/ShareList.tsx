import { useCallback, useEffect, useState } from "react";
import { apiClient } from "@/apiClient";
import { ChatUserDataType } from "./types/user-data-types";
import { useToast } from "@/hooks/use-toast";
import UserListCard from "@/pages/user/components/UserListCard";
import { useSocket } from "@/hooks/use-socket";
import { Button } from "./ui/button";
import { MessageType } from "@/types/message-type";

interface Props {
  data: {
    message?: string | undefined;
    image?: string | undefined;
    type: "image" | "text" | "post";
  };
}

const ShareList: React.FC<Props> = ({ data }) => {
  const socket = useSocket();
  const { toast } = useToast();
  const [chatList, setChatList] = useState<ChatUserDataType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [sentList, setSentList] = useState<
    Record<string, "shared" | "sharing">
  >({});

  const sharePost = useCallback(
    (username: string) => {
      setSentList({ ...sentList, [username]: "sharing" });
      socket?.emit("send-message", username, data);
    },
    [socket, data]
  );

  useEffect(() => {
    setLoading(true);
    apiClient
      .get("/conversations/")
      .then((response) => setChatList(response.data.conversations))
      .catch((error) => {
        toast({
          description:
            error.response?.data?.message ||
            error.message ||
            "Something went wrong",
          variant: "destructive",
        });
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
          newMessage.to &&
          sentList[newMessage.to]
        ) {
          return { ...prevState, [newMessage.to]: "shared" };
        }

        return prevState;
      });
    };

    socket.on("send-message-success", handleShareSuccess);

    return () => {
      socket.off("send-message-success", handleShareSuccess);
    };
  }, [socket, sentList]);

  return (
    <div className="w-full h-full mt-[-0.5rem] overflow-y-scroll no-scrollbar">
      {chatList.length && !loading ? (
        chatList.map((chat) => (
          <UserListCard
            key={chat._id}
            userData={chat}
            className="my-2"
            actions={
              <Button
                className="h-7 capitalize"
                onClick={() => sharePost(chat.username)}
                disabled={!!sentList[chat.username]}
              >
                {sentList[chat.username] || "Share"}
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
