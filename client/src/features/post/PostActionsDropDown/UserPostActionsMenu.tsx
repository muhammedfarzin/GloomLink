import { apiClient } from "@/apiClient";
import ConfirmButton from "@/components/ConfirmButton";
import {
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
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
  const { toast } = useToast();

  const reportPost = () => {
    apiClient
      .post(`/report`, { targetId: postId, type: "post" })
      .then((response) => {
        toast({
          description: response.data?.message || "Post reported successfully",
        });
      })
      .catch((error) => {
        toast({
          description: error.message || "Something went wrong",
          variant: "destructive",
        });
      });
  };

  return (
    <DropdownMenuContent className="w-20">
      {isPublisher ? (
        <>
          <DropdownMenuItem onClick={() => navigate(`/edit-post/${postId}`)}>
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
