import ProfileImage from "../ProfileImage";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { useState } from "react";
import { apiClient } from "@/apiClient";
import { useToast } from "@/hooks/use-toast";
import type { HandleReplyCommentType } from "./types/ReplyCommentType";
import type Comment from "./types/Comment";
import { formatTimeAgo } from "@/lib/dateUtils";

interface CommentListCardProps {
  comment: Comment;
  showReplies?: boolean;
  isReply?: boolean;
  handleReplyOnClick?: (handleReplyComment: HandleReplyCommentType) => void;
}

const CommentListCard: React.FC<CommentListCardProps> = ({
  comment,
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
        const response = await apiClient.get(`/comments`, {
          params: { targetId: comment.id, type: "comment" },
        });
        setReplies(response.data.commentsData);
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
        <Link to={`/${comment.uploadedBy.username}`}>
          <ProfileImage
            className="w-10"
            profileImage={comment.uploadedBy.image}
          />
        </Link>

        <div className="w-full">
          <div className="flex items-center gap-2">
            <Link
              to={`/${comment.uploadedBy.username}`}
              className="text-sm font-bold m-0"
            >
              {comment.uploadedBy.username}
            </Link>
            <span className="text-xs text-gray-500 -mx-1">•</span>
            <p className="text-xs text-muted-foreground">
              {formatTimeAgo(comment.createdAt)}
            </p>
          </div>
          <p
            tabIndex={0}
            className="line-clamp-3 focus:line-clamp-none max-h-[4.5rem] transition-all duration-1000 focus:max-h-[5000px]"
          >
            {comment.comment}
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
                  key={replyData.id}
                  comment={replyData}
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
