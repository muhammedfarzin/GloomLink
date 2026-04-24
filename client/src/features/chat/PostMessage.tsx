import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiClient } from "@/apiClient";
import { useToaster } from "@/hooks/useToaster";
import type { CompactPost } from "@/types/post";
import type { MessageType } from "@/types/message-type";

interface Props {
  data: Omit<MessageType, "type">;
}

const PostMessage: React.FC<Props> = ({ data }) => {
  const { toastError } = useToaster();
  const [postData, setPostData] = useState<CompactPost>();

  useEffect(() => {
    apiClient
      .get(`/posts/${data.message}`)
      .then((response) => setPostData(response.data.postData))
      .catch((error) => toastError(error.message));
  }, [data]);

  return (
    postData && (
      <div className="max-w-xs cursor-pointer">
        {
          <span className="text-sm text-foreground/50">
            Post from{" "}
            <Link
              to={`/${postData.uploadedBy.username}`}
              className="cursor-pointer hover:underline"
            >
              {postData.uploadedBy.username}
            </Link>
          </span>
        }
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
    )
  );
};

export default PostMessage;
