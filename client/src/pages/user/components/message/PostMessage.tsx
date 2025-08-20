import apiClient from "@/apiClient";
import type PostDataType from "@/components/post/types/PostDataType";
import { useToast } from "@/hooks/use-toast";
import { MessageType } from "@/types/message-type";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface Props {
  data: Omit<MessageType, "type">;
}

const PostMessage: React.FC<Props> = ({ data }) => {
  const { toast } = useToast();
  const [postData, setPostData] = useState<PostDataType>();

  useEffect(() => {
    apiClient
      .get(`/posts/${data.message}`)
      .then((response) => setPostData(response.data))
      .catch((error) =>
        toast({
          description: error.message,
          variant: "destructive",
        })
      );
  }, [data]);

  return (
    <div className="max-w-xs cursor-pointer">
      {data.from && (
        <span className="text-sm text-foreground/50">
          Post from{" "}
          <Link to={`/${data.from}`} className="cursor-pointer hover:underline">
            {data.from}
          </Link>
        </span>
      )}
      {postData && (
        <div>
          <img
            className="rounded-lg"
            src={postData.images[0]}
            alt="post image"
          />
          <span
            tabIndex={0}
            className="line-clamp-[1] focus:line-clamp-none mt-2"
          >
            {postData.caption}
          </span>
        </div>
      )}
    </div>
  );
};

export default PostMessage;
