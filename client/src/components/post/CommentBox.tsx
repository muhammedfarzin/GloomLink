import { useEffect, useState } from "react";
import IconButton from "../IconButton";
import InputBox from "../InputBox";
import CommentListCard, { type Comment } from "./CommentListCard";
import PaperPlaneIcon from "@/assets/icons/PaperPlane.svg";
import apiClient from "@/apiClient";
import { useToast } from "@/hooks/use-toast";

interface CommentBoxProps {
  postId: string;
}

const CommentBox: React.FC<CommentBoxProps> = ({ postId }) => {
  const { toast } = useToast();
  const [commentInput, setCommentInput] = useState<string>("");
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState<string | null>(null);
  const [disableForm, setDisableForm] = useState<boolean>(false);

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
      .get(`/posts/${postId}/comments`)
      .then((response) => {
        setComments(response.data);

        apiClient
          .get(`/posts/${postId}/mycomments`)
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
      setDisableForm(true);
      const response = await apiClient.post(`/posts/${postId}/comment`, {
        comment: commentInput,
      });

      setCommentInput("");
      const newComment = response.data.comment;
      setComments([newComment, ...comments]);
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
  console.log(comments);
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
              <CommentListCard
                key={comment._id}
                comment={comment.comment}
                username={comment.uploadedBy.username}
                image={comment.uploadedBy.image}
              />
            ))}
          </div>
        )}
      </div>
      <div className="flex items-center gap-2 w-full border-t border-[#6b728033] py-1 px-2">
        <InputBox
          type="text"
          placeholder="Add a comment..."
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
    </>
  );
};

export default CommentBox;
