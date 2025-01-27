import ThreeDotsVerticalIcon from "@/assets/icons/ThreeDotsVertical.svg";
import { Button } from "../ui/button";
import { FlagTriangleLeft } from "lucide-react";
import ConfirmButton from "../ConfirmButton";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "../ui/dropdown-menu";
import apiClient from "@/apiClient";
import { useToast } from "@/hooks/use-toast";
import type { Post } from "./PostListCard";
import adminApiClient from "@/adminApiClient";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

interface PostActionsDropDownProps {
  postId: string;
  status: Post["status"];
  isAdmin?: boolean;
  handleChange?: React.Dispatch<React.SetStateAction<Post[]>>;
}

const PostActionsDropDown: React.FC<PostActionsDropDownProps> = ({
  postId,
  status,
  isAdmin = false,
  handleChange,
}) => {
  const colorTheme = useSelector((state: RootState) => state.theme.colorTheme);
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

  const handleDeletePost = () => {
    adminApiClient.delete(`/posts/${postId}`).then((response) => {
      handleChange?.((state) => state.filter((post) => post._id !== postId));
      toast({
        description: response.data.message || "Post deleted successfully",
      });
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="rounded-full aspect-square p-2">
          <img
            src={ThreeDotsVerticalIcon}
            alt="more"
            style={{
              filter: `invert(${colorTheme.text === "#ffffff" ? 0 : 1})`,
            }}
          />
        </Button>
      </DropdownMenuTrigger>

      {!isAdmin ? (
        <DropdownMenuContent className="w-20">
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
        </DropdownMenuContent>
      ) : (
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
            onSuccess={handleDeletePost}
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
