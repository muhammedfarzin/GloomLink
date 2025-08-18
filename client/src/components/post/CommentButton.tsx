import React, { Suspense } from "react";
import IconButton from "../IconButton";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import CommentIcon from "@/assets/icons/Comment.svg";
import { type Props as PostListCardProps } from "./PostListCard";
import CommentBox from "./CommentBox";
import PostSkeleton from "../skeleton/PostSkeleton";

const PostListCard = React.lazy(() => import("./PostListCard"));

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
            <Suspense fallback={<PostSkeleton />}>
              <PostListCard
                className="h-full rounded-s-lg"
                hideComment
                captionLine={1}
                {...postCardData}
              />
            </Suspense>
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
