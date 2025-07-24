import { Button } from "@/components/ui/button";
import { EllipsisVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import apiClient from "@/apiClient";
import { useToast } from "@/hooks/use-toast";
import type { Post } from "../types/Post";
import adminApiClient from "@/adminApiClient";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import UserPostActionsMenu from "./UserPostActionsMenu";
import AdminPostActionsMenu from "./AdminPostActionsMenu";

interface PostActionsDropDownProps {
  postId: string;
  userId: string;
  status: Post["status"];
  isAdmin?: boolean;
  handleChange?: React.Dispatch<React.SetStateAction<Post[]>>;
}

const PostActionsDropDown: React.FC<PostActionsDropDownProps> = ({
  postId,
  userId,
  status,
  isAdmin = false,
  handleChange,
}) => {
  const myUserId = useSelector((state: RootState) => state.auth.userData?._id);
  const { toast } = useToast();

  const handleDeletePost = async (userType: "user" | "admin" = "user") => {
    try {
      if (userType === "user") {
        var response = await apiClient.delete(`/posts/${postId}`);
      } else {
        var response = await adminApiClient.delete(`/posts/${postId}`);
      }

      handleChange?.((state) => state.filter((post) => post._id !== postId));
      toast({
        description: response.data.message || "Post deleted successfully",
      });
    } catch (error: any) {
      toast({
        description:
          error.response?.data?.message ||
          error.message ||
          "Post deleted successfully",
        variant: "destructive",
      });
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="rounded-full aspect-square p-2 hover:bg-[#9ca3af66]"
        >
          <EllipsisVertical />
        </Button>
      </DropdownMenuTrigger>

      {isAdmin ? (
        // Admin
        <AdminPostActionsMenu
          postId={postId}
          status={status}
          onDeletePost={handleDeletePost}
          onBlockStatusChange={(newStatus) => {
            handleChange?.((state) =>
              state.map((post) => {
                if (post._id === postId) post.status = newStatus;
                return post;
              })
            );
          }}
        />
      ) : (
        // User
        <UserPostActionsMenu
          postId={postId}
          isPublisher={myUserId === userId}
          onDeletePost={handleDeletePost}
        />
      )}
    </DropdownMenu>
  );
};

export default PostActionsDropDown;
