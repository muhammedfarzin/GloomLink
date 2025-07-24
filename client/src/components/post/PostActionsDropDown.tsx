import { Button } from "../ui/button";
import { FlagTriangleLeft, EllipsisVertical, Trash2, Edit } from "lucide-react";
import ConfirmButton from "../ConfirmButton";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "../ui/dropdown-menu";
import apiClient from "@/apiClient";
import { useToast } from "@/hooks/use-toast";
import type { Post } from "./types/Post";
import adminApiClient from "@/adminApiClient";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();
  const myUserId = useSelector((state: RootState) => state.auth.userData?._id);
  const { toast } = useToast();

  const reportPost = () => {
    apiClient
      .post(`/posts/report/${postId}`)
      .then((response) => {
        toast({
          description: response.data?.message || "Post reported successfully",
        });
      })
      .catch((error) => {
        toast({
          description:
            error.response?.data?.message ||
            error.message ||
            "Something went wrong",
          variant: "destructive",
        });
      });
  };

  const handleBlockPost = (type: "block" | "unblock") => {
    adminApiClient
      .put(`/posts/${type}/${postId}`)
      .then((response) => {
        handleChange?.((state) => {
          return state.map((post) => {
            if (post._id === postId)
              post.status = type === "block" ? "blocked" : "active";
            return post;
          });
        });
        toast({
          description: response.data.message || `Post ${type}ed successfully`,
        });
      })
      .catch((error) => {
        toast({
          description:
            error.response?.data?.message ||
            error.message ||
            "Something went wrong",
          variant: "destructive",
        });
      });
  };

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

      {!isAdmin ? (
        // User
        <DropdownMenuContent className="w-20">
          {myUserId === userId ? (
            <>
              <DropdownMenuItem
                onClick={() => navigate(`/edit-post/${postId}`)}
              >
                <Edit />
                <span>Edit</span>
              </DropdownMenuItem>
              <ConfirmButton
                description="Do you really want to delete this post?"
                confirmButtonText="Delete"
                onSuccess={() => handleDeletePost("user")}
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
      ) : (
        // Admin
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
            onSuccess={() => handleDeletePost("admin")}
            className="w-full"
          >
            <DropdownMenuItem>
              <span>Delete</span>
            </DropdownMenuItem>
          </ConfirmButton>
        </DropdownMenuContent>
      )}
    </DropdownMenu>
  );
};

export default PostActionsDropDown;
