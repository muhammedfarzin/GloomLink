import { useEffect, useState } from "react";
import CommentListCard from "./CommentListCard";
import apiClient from "@/apiClient";
import { useToast } from "@/hooks/use-toast";
import type { ReplyCommentType } from "./types/ReplyCommentType";
import Comment from "./types/Comment";
import CommentInputBox from "./CommentInputBox";

interface CommentBoxProps {
  postId: string;
}

const CommentBox: React.FC<CommentBoxProps> = ({ postId }) => {
  const { toast } = useToast();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState<string | null>(null);
  const [replyComment, setReplyComment] = useState<ReplyCommentType | null>(
    null
  );

  useEffect(() => {
    setLoading("Fetching comments...");
    const toastError = (error: any) => {
      toast({
        description:
          error.response?.data?.message ||
          error.message ||
          "Something went wrong",
        variant: "destructive",
      });
    };

    apiClient
      .get(`/comments/${postId}`, { params: { type: "post" } })
      .then((response) => {
        setComments(response.data);

        apiClient
          .get(`/comments/${postId}/self`, { params: { type: "post" } })
          .then((response) => {
            setComments((prevState) => [...response.data, ...prevState]);
          })
          .catch((error) => {
            toastError(error);
          });
      })
      .catch((error) => {
        toastError(error);
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
            loading || !comments.length
              ? "justify-center items-center"
              : "flex-col",
          ].join(" ")}
        >
          {loading || !comments.length
            ? loading || "No comments yet!"
            : comments.map((comment) => (
                <div key={comment._id}>
                  <CommentListCard
                    commentId={comment._id}
                    comment={comment.comment}
                    username={comment.uploadedBy.username}
                    image={comment.uploadedBy.image}
                    showReplies={!!comment.replies}
                    handleReplyOnClick={(handleReplyComment) =>
                      setReplyComment({
                        commentId: comment._id,
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
