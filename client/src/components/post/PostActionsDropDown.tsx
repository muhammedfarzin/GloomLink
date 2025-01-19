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

interface PostActionsDropDownProps {
  postId: string;
}

const PostActionsDropDown: React.FC<PostActionsDropDownProps> = ({
  postId,
}) => {
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

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="rounded-full aspect-square p-2">
          <img src={ThreeDotsVerticalIcon} alt="more" />
        </Button>
      </DropdownMenuTrigger>

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
    </DropdownMenu>
  );
};

export default PostActionsDropDown;
