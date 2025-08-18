import React, { Suspense } from "react";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import CommentBox from "./CommentBox";
import PostSkeleton from "../skeleton/PostSkeleton";

const PostListCard = React.lazy(() => import("./PostListCard"));

interface PostGridCardProps {
  image?: string;
  caption?: string;
  postId: string;
}

const PostGridCard: React.FC<PostGridCardProps> = ({
  image,
  caption,
  postId,
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="border rounded-md md:rounded-3xl cursor-pointer border-border aspect-square w-[calc(33.73%-0.5rem)]">
          {image ? (
            <img
              className="rounded-md md:rounded-3xl h-full w-full object-cover"
              src={image}
              alt="post"
            />
          ) : (
            <div className="flex justify-center items-center h-full w-full">
              <span
                className="line-clamp-6 p-3 max-h-[70%] text-center"
                title={caption}
              >
                {caption}
              </span>
            </div>
          )}
        </div>
      </DialogTrigger>
      <DialogContent className="w-full max-w-[1000px] h-screen md:h-[82vh] p-0">
        <div className="flex">
          {/* Post Card */}
          <div className="w-full md:w-1/2 h-screen md:h-[82vh]">
            <Suspense
              fallback={
                <PostSkeleton className="h-full rounded-s-lg rounded-e-none" />
              }
            >
              <PostListCard
                postId={postId}
                className="h-full rounded-s-lg"
                hideComment
                captionLine={1}
              />
            </Suspense>
          </div>

          {/* Comment Box */}
          <div className="hidden md:block w-1/2 h-full">
            <CommentBox postId={postId} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PostGridCard;
