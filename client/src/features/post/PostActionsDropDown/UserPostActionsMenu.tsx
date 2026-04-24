import { apiClient } from "@/apiClient";
import ConfirmButton from "@/components/ConfirmButton";
import {
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { useToaster } from "@/hooks/useToaster";
import { Edit, FlagTriangleLeft, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Props {
  postId: string;
  isPublisher?: boolean;
  onDeletePost?: (userType?: "user" | "admin") => void;
}

const UserPostActionsMenu: React.FC<Props> = ({
  postId,
  isPublisher,
  onDeletePost,
}) => {
  const navigate = useNavigate();
  const { toastMessage, toastError } = useToaster();

  const reportPost = () => {
    apiClient
      .post(`/report`, { targetId: postId, type: "post" })
      .then((response) => {
        toastMessage(response.data?.message || "Post reported successfully");
      })
      .catch((error) => {
        toastError(error.message);
      });
  };

  return (
    <DropdownMenuContent className="w-20">
      {isPublisher ? (
        <>
          <DropdownMenuItem onClick={() => navigate(`/post/${postId}/edit`)}>
            <Edit />
            <span>Edit</span>
          </DropdownMenuItem>
          <ConfirmButton
            description="Do you really want to delete this post?"
            confirmButtonText="Delete"
            onSuccess={() => onDeletePost?.("user")}
            className="w-full"
          >
            <DropdownMenuItem>
              <Trash2 />
              <span>Delete</span>
            </DropdownMenuItem>
          </ConfirmButton>
        </>
      ) : (
        <ConfirmButton
          description="Do you really want to report this post?"
          confirmButtonText="Report"
          onSuccess={reportPost}
          className="w-full"
        >
          <DropdownMenuItem>
            <FlagTriangleLeft />
            <span>Report</span>
          </DropdownMenuItem>
        </ConfirmButton>
      )}
    </DropdownMenuContent>
  );
};

export default UserPostActionsMenu;
