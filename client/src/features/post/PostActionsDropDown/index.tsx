import { Button } from "@/components/ui/button";
import { EllipsisVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { apiClient, adminApiClient } from "@/apiClient";
import { useToaster } from "@/hooks/useToaster";
import { useSelector } from "react-redux";
import UserPostActionsMenu from "./UserPostActionsMenu";
import AdminPostActionsMenu from "./AdminPostActionsMenu";
import type { Post } from "@/types/post";
import type { RootState } from "@/redux/store";

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
  const myUserId = useSelector(
    (state: RootState) => state.auth.userData?.userId,
  );
  const { toastMessage, toastError } = useToaster();

  const handleDeletePost = async (userType: "user" | "admin" = "user") => {
    try {
      if (userType === "user") {
        var response = await apiClient.delete(`/posts/${postId}`);
      } else {
        var response = await adminApiClient.delete(`/posts/${postId}`);
      }

      handleChange?.((state) => state.filter((post) => post.postId !== postId));
      toastMessage(response.data.message || "Post deleted successfully");
    } catch (error: any) {
      toastError(error.message);
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
                if (post.postId === postId) post.status = newStatus;
                return post;
              }),
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
