import IconButton from "../IconButton";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import CommentIcon from "@/assets/icons/Comment.svg";
import PostListCard, { type Props as PostListCardProps } from "./PostListCard";
import CommentBox from "./CommentBox";

interface CommentButtonProps {
  postCardData: PostListCardProps;
  postId: string;
}

const CommentButton: React.FC<CommentButtonProps> = ({
  postCardData,
  postId,
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <IconButton icon={CommentIcon} alt="comment" />
      </DialogTrigger>
      <DialogContent className="w-full max-w-[1000px] h-screen md:h-[82vh] p-0">
        <div className="flex">
          {/* Post Card */}
          <div className="hidden md:block w-1/2 h-screen md:h-[82vh]">
            <PostListCard
              className="h-full rounded-s-lg"
              hideComment
              captionLine={1}
              {...postCardData}
            />
          </div>

          {/* Comment Box */}
          <div className="w-full md:w-1/2 h-full">
            <CommentBox postId={postId} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CommentButton;
