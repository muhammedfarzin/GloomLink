import { useEffect, useState } from "react";
import IconButton from "../IconButton";
import InputBox from "../InputBox";
import CommentListCard, {
  HandleReplyCommentType,
  type Comment,
} from "./CommentListCard";
import PaperPlaneIcon from "@/assets/icons/PaperPlane.svg";
import apiClient from "@/apiClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "../ui/button";
import { X } from "lucide-react";

interface ReplyCommentType {
  commentId: string;
  username: string;
  handleReplyComment: HandleReplyCommentType;
}

interface CommentBoxProps {
  postId: string;
}

const CommentBox: React.FC<CommentBoxProps> = ({ postId }) => {
  const { toast } = useToast();
  const [commentInput, setCommentInput] = useState<string>("");
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState<string | null>(null);
  const [disableForm, setDisableForm] = useState<boolean>(false);
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

  const handlePostComment = async () => {
    try {
      if (!commentInput.trim()) throw new Error("Please enter a comment");

      setDisableForm(true);
      const response = await apiClient.post(`/comments/add`, {
        comment: commentInput,
        ...(replyComment
          ? {
              targetId: replyComment.commentId,
              type: "comment",
            }
          : {
              targetId: postId,
              type: "post",
            }),
      });

      setCommentInput("");
      setReplyComment(null);
      const newComment = response.data.comment;

      if (replyComment) replyComment.handleReplyComment(newComment);
      else setComments([newComment, ...comments]);
    } catch (error: any) {
      toast({
        description:
          error.response?.data?.message ||
          error.message ||
          "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setDisableForm(false);
    }
  };

  return (
    <>
      <h3 className="text-lg font-bold my-2 mx-4">Comments</h3>
      <div className="px-4 overflow-y-scroll no-scrollbar">
        {loading || !comments.length ? (
          <div className="flex justify-center items-center gap-2 w-full h-[calc(100vh-6.35rem)] md:h-[calc(82vh-6.35rem)]">
            {loading || "No comments yet!"}
          </div>
        ) : (
          <div className="flex flex-col gap-2 w-full h-[calc(100vh-6.35rem)] md:h-[calc(82vh-6.35rem)]">
            {comments.map((comment) => (
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
        )}
      </div>

      <div className="relative">
        {replyComment && (
          <div className="absolute -top-12 flex justify-between items-center w-full border-t bg-secondary border-[#6b728033] py-1 px-2">
            <span>Replying to {replyComment?.username}</span>
            <Button
              variant="ghost"
              className="hover:bg-[#9ca3af66] hover:text-current"
              onClick={() => setReplyComment(null)}
            >
              <X />
            </Button>
          </div>
        )}

        <div className="flex items-center gap-2 w-full border-t bg-secondary border-[#6b728033] py-1 px-2 rounded-br-lg">
          <InputBox
            type="text"
            placeholder={`Add a ${replyComment ? "reply" : "comment"}...`}
            value={commentInput}
            onChange={(e) => setCommentInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handlePostComment();
              }
            }}
            disabled={disableForm}
          />
          <IconButton
            icon={PaperPlaneIcon}
            alt="send"
            onClick={handlePostComment}
            disabled={disableForm}
          />
        </div>
      </div>
    </>
  );
};

export default CommentBox;
