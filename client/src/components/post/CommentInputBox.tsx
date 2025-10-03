import { X } from "lucide-react";
import { Button } from "../ui/button";
import { ReplyCommentType } from "./types/ReplyCommentType";
import InputBox from "../InputBox";
import { useState } from "react";
import IconButton from "../IconButton";
import PaperPlaneIcon from "@/assets/icons/PaperPlane.svg";
import { apiClient } from "@/apiClient";
import { useToast } from "@/hooks/use-toast";
import Comment from "./types/Comment";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";

interface Props {
  replyComment?: ReplyCommentType | null;
  postId: string;
  onReplyCancel?: (value: null) => void;
  onPublished?: (newComment: Comment) => void;
}

const CommentInputBox: React.FC<Props> = ({
  replyComment,
  postId,
  onReplyCancel,
  onPublished,
}) => {
  const { toast } = useToast();
  const [commentInput, setCommentInput] = useState<string>("");
  const [disableForm, setDisableForm] = useState<boolean>(false);
  const userData = useSelector((state: RootState) => state.auth.userData);

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
      onReplyCancel?.(null);
      const newComment = response.data.commentData;

      onPublished?.({ ...newComment, uploadedBy: userData });
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
    <div className="relative">
      {replyComment && (
        <div className="absolute -top-12 flex justify-between items-center w-full border-t bg-secondary border-[#6b728033] py-1 px-2">
          <span>Replying to {replyComment?.username}</span>
          <Button
            variant="ghost"
            className="hover:bg-[#9ca3af66] hover:text-current"
            onClick={() => onReplyCancel?.(null)}
          >
            <X />
          </Button>
        </div>
      )}

      <div className="flex items-center gap-2 w-full border-t bg-secondary border-[#6b728033] py-1 px-2 rounded-b-lg md:rounded-bl-none">
        <InputBox
          type="text"
          placeholder={`Add a ${replyComment ? "reply" : "comment"}...`}
          value={commentInput}
          onChange={(e) => setCommentInput?.(e.target.value)}
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
  );
};

export default CommentInputBox;
