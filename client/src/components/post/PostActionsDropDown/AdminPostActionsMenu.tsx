import { adminApiClient } from "@/apiClient";
import ConfirmButton from "@/components/ConfirmButton";
import {
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { Post } from "../types/Post";

interface Props {
  postId: string;
  status: Post["status"];
  onDeletePost?: (userType?: "user" | "admin") => void;
  onBlockStatusChange?: (newStatus: Post["status"]) => void;
}

const AdminPostActionsMenu: React.FC<Props> = ({
  postId,
  status,
  onDeletePost,
  onBlockStatusChange,
}) => {
  const { toast } = useToast();

  const handleBlockPost = (type: "block" | "unblock") => {
    adminApiClient
      .patch(`/posts/block/${postId}`)
      .then((response) => {
        onBlockStatusChange?.(type === "block" ? "blocked" : "active");
        toast({
          description: response.data.message || `Post ${type}ed successfully`,
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
      <ConfirmButton
        description="Do you really want to block this post?"
        confirmButtonText={status === "active" ? "Block" : "Unblock"}
        onSuccess={() =>
          handleBlockPost(status === "active" ? "block" : "unblock")
        }
        className="w-full"
      >
        <DropdownMenuItem>
          <span>{status === "active" ? "Block" : "Unblock"}</span>
        </DropdownMenuItem>
      </ConfirmButton>
      <ConfirmButton
        description="Do you really want to delete this post?"
        confirmButtonText="Delete"
        onSuccess={() => onDeletePost?.("admin")}
        className="w-full"
      >
        <DropdownMenuItem>
          <span>Delete</span>
        </DropdownMenuItem>
      </ConfirmButton>
    </DropdownMenuContent>
  );
};

export default AdminPostActionsMenu;
