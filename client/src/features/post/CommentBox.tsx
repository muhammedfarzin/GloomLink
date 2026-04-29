import { useEffect, useState } from "react";
import { apiClient } from "@/apiClient";
import { useToaster } from "@/hooks/useToaster";
import type { Comment, ReplyCommentType } from "@/types/comment";
import CommentListCard from "./CommentListCard";
import CommentInputBox from "./CommentInputBox";
import { CommentSkeleton } from "@/components/skeleton/CommentBoxSkeleton";

interface CommentBoxProps {
  postId: string;
}

const CommentBox: React.FC<CommentBoxProps> = ({ postId }) => {
  const { toastError } = useToaster();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState<string | null>(null);
  const [replyComment, setReplyComment] = useState<ReplyCommentType | null>(
    null,
  );

  useEffect(() => {
    setLoading("Fetching comments...");

    apiClient
      .get(`/comments`, { params: { targetId: postId, type: "post" } })
      .then((response) => {
        setComments(response.data.commentsData);
      })
      .catch((error) => {
        toastError(error.message);
      })
      .finally(() => setLoading(null));
  }, [postId]);

  return (
    <>
      <h3 className="text-lg font-bold my-2 mx-4">Comments</h3>
      <div className="px-4 overflow-y-scroll no-scrollbar">
        <div
          className={[
            "flex gap-2 w-full h-[calc(95vh-6.35rem)] md:h-[calc(82vh-6.35rem)]",
            !loading && !comments.length
              ? "justify-center items-center"
              : "flex-col",
          ].join(" ")}
        >
          {loading
            ? Array.from({ length: 5 }).map((_, i) => (
                <CommentSkeleton key={i} />
              ))
            : !comments.length
              ? "No comments yet!"
              : comments.map((comment) => (
                  <div key={comment.id}>
                    <CommentListCard
                      comment={comment}
                      showReplies={!!comment.repliesCount}
                      handleReplyOnClick={(handleReplyComment) =>
                        setReplyComment({
                          commentId: comment.id,
                          username: comment.uploadedBy.username,
                          handleReplyComment,
                        })
                      }
                    />
                  </div>
                ))}
        </div>
      </div>

      <CommentInputBox
        postId={postId}
        replyComment={replyComment}
        onReplyCancel={setReplyComment}
        onPublished={(newComment) => {
          if (replyComment) replyComment.handleReplyComment(newComment);
          else setComments([newComment, ...comments]);
        }}
      />
    </>
  );
};

export default CommentBox;
