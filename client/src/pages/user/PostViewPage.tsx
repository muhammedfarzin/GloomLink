import React, { Suspense } from "react";
import PostSkeleton from "@/components/skeleton/PostSkeleton";
import CommentBoxSkeleton from "@/components/skeleton/CommentBoxSkeleton";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  Navigate,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";

const PostListCard = React.lazy(() => import("@/features/post/PostListCard"));
const CommentBox = React.lazy(() => import("@/features/post/CommentBox"));

const PostViewPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { postId } = useParams();

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      if (location.state?.backgroundLocation) {
        navigate(-1);
      } else {
        navigate("/");
      }
    }
  };

  if (!postId) return <Navigate to="/" />;

  return (
    <Dialog open onOpenChange={handleOpenChange}>
      <DialogContent className="w-11/12 max-w-lg md:max-w-[1000px] h-[95vh] md:h-[82vh] max-h-screen rounded-lg p-0 z-50">
        <div className="flex">
          {/* Post Card */}
          <div className="w-full md:w-1/2 h-[95vh] md:h-[82vh] max-h-screen">
            <Suspense
              fallback={
                <PostSkeleton className="h-full rounded-s-lg rounded-e-none" />
              }
            >
              <PostListCard
                postId={postId}
                className="h-full rounded-lg md:rounded-e-none"
                hideComment
                showCommentsForSm
                captionLine={1}
              />
            </Suspense>
          </div>

          {/* Comment Box */}
          <div className="hidden md:block w-1/2 h-full">
            <Suspense fallback={<CommentBoxSkeleton />}>
              <CommentBox postId={postId} />
            </Suspense>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PostViewPage;
