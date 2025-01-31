import ProfileImage from "../ProfileImage";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { useState } from "react";
import apiClient from "@/apiClient";
import { useToast } from "@/hooks/use-toast";

export interface Comment {
  _id: string;
  comment: string;
  targetId: string;
  userId: string;
  type: "post";
  replies: number;
  uploadedBy: {
    _id: string;
    firstname: string;
    lastname: string;
    username: string;
    image?: string;
  };
}

export type HandleReplyCommentType = (newReply: Comment) => void;

interface CommentListCardProps {
  commentId: string;
  comment: Comment["comment"];
  username: Comment["uploadedBy"]["username"];
  image?: Comment["uploadedBy"]["image"];
  showReplies?: boolean;
  isReply?: boolean;
  handleReplyOnClick?: (handleReplyComment: HandleReplyCommentType) => void;
}

const CommentListCard: React.FC<CommentListCardProps> = ({
  commentId,
  comment,
  image,
  username,
  isReply = false,
  showReplies = false,
  handleReplyOnClick,
}) => {
  const { toast } = useToast();
  const [showReply, setShowReply] = useState<boolean>(false);
  const [loading, setLoading] = useState<string | null>(null);
  const [replies, setReplies] = useState<Comment[]>([]);

  const handleReplyComment: HandleReplyCommentType = (newReply) => {
    setReplies([newReply, ...replies]);
    setShowReply(true);
  };

  const handleShowReplyClick = async () => {
    setShowReply(!showReply);
    try {
      if (!showReply) {
        setLoading("Fetching replies...");
        const response = await apiClient.get(`/comments/${commentId}`, {
          params: { type: "comment" },
        });
        setReplies(response.data);

        const myResponse = await apiClient.get(`/comments/${commentId}/self`, {
          params: { type: "comment" },
        });
        setReplies((prevState) => [...myResponse.data, ...prevState]);
      }
    } catch (error: any) {
      setShowReply(false);
      toast({
        description:
          error.response.data.message || error.message || "Someting went wrong",
        variant: "destructive",
      });
    } finally {
      setLoading(null);
    }
  };

  return (
    <>
      <div className="flex p-2 rounded-lg items-start bg-primary">
        <Link to={`/${username}`}>
          <ProfileImage className="w-10" profileImage={image} />
        </Link>

        <div className="w-full">
          <Link to={`/${username}`} className="text-sm font-bold m-0">
            {username}
          </Link>
          <p
            tabIndex={0}
            className="line-clamp-3 focus:line-clamp-none max-h-[4.5rem] transition-all duration-1000 focus:max-h-[5000px]"
          >
            {comment}
          </p>

          {!isReply && (
            <div className="flex justify-end">
              <Button
                variant="ghost"
                className="hover:bg-[#9ca3af66] hover:text-current h-6"
                onClick={() => handleReplyOnClick?.(handleReplyComment)}
              >
                Reply
              </Button>
            </div>
          )}
        </div>
      </div>

      {!isReply && (
        <>
          {showReply && !loading && (
            <div className="flex flex-col gap-1 mt-1 ml-10">
              {replies.map((replyData) => (
                <CommentListCard
                  key={replyData._id}
                  commentId={replyData._id}
                  comment={replyData.comment}
                  username={replyData.uploadedBy.username}
                  image={replyData.uploadedBy.image}
                  isReply
                />
              ))}
            </div>
          )}
          {showReplies && (
            <div
              className="ml-16 text-xs hover:underline cursor-pointer mb-2"
              onClick={handleShowReplyClick}
            >
              {loading || `${showReply ? "Hide" : "Show"} replies`}
            </div>
          )}
        </>
      )}
    </>
  );
};

export default CommentListCard;
