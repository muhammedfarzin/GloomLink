import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { ViewTracker } from "@/components/ViewTracker";
import PostSkeleton from "@/components/skeleton/PostSkeleton";
import { useInteraction } from "@/hooks/useInteraction";
import { useToaster } from "@/hooks/useToaster";
import { apiClient } from "@/apiClient";
import PostActionsDropDown from "./PostActionsDropDown";
import PostActions from "./PostActions";
import ProfileViewCard from "@/features/profile/ProfileViewCard";
import PostInteractionCount from "./PostInteractionCount";
import PostView from "./PostView";
import { formatTimeAgo } from "@/lib/dateUtils";
import type { Post, CompactPost } from "@/types/post";
import type { RootState } from "@/redux/store";

export interface PostListCardProps {
  postId: string;
  postData?: CompactPost;
  isAdmin?: boolean;
  className?: string;
  hideComment?: boolean;
  showCommentsForSm?: boolean;
  captionLine?: number;
  noRecordInteraction?: boolean;
  handleChange?: React.Dispatch<React.SetStateAction<Post[]>>;
}

const PostListCard: React.FC<PostListCardProps> = ({
  postId,
  postData,
  isAdmin = false,
  className,
  hideComment,
  showCommentsForSm,
  captionLine,
  noRecordInteraction,
  handleChange,
}) => {
  const authId = useSelector((state: RootState) => state.auth.userData?.userId);
  const { toastError } = useToaster();
  const { recordInteraction } = useInteraction();
  const [postDataState, setPostDataState] = useState(postData);

  useEffect(() => {
    if (!postData) {
      apiClient
        .get(`/posts/${postId}`)
        .then((response) => {
          setPostDataState(response.data.postData);
        })
        .catch((error) => {
          toastError(error.message);
        });
    }
  }, [postData]);

  const onSavePost = useCallback(
    (isSaved: boolean) =>
      postDataState && setPostDataState({ ...postDataState, isSaved }),
    [postDataState, setPostDataState],
  );

  const onLikePost = useCallback(
    (isLiked: boolean, count?: number) =>
      postDataState &&
      setPostDataState({
        ...postDataState,
        isLiked,
        likesCount: count,
      }),
    [postDataState, setPostDataState],
  );

  const handleView = useCallback(() => {
    if (
      !noRecordInteraction &&
      postDataState &&
      postDataState.uploadedBy.userId !== authId
    ) {
      recordInteraction(postDataState.postId, "view");
    }
  }, [postDataState, recordInteraction, authId, noRecordInteraction]);

  if (!postDataState)
    return <PostSkeleton className="h-full rounded-s-lg rounded-e-none" />;

  return (
    <ViewTracker onView={handleView}>
      <div
        className={`flex flex-col gap-4 bg-primary/30 hover:bg-primary/40 border border-primary/20 backdrop-blur-sm p-5 w-full max-w-lg shadow-lg transition-all duration-300 ${
          className || "rounded-2xl"
        }`}
      >
        {/* Uploaded By */}
        <div className="flex justify-between">
          <ProfileViewCard userData={postDataState.uploadedBy}>
            <span className="text-xs text-gray-500 mt-0">
              {formatTimeAgo(postDataState.createdAt)}
            </span>
          </ProfileViewCard>
          <PostActionsDropDown
            postId={postDataState.postId}
            userId={postDataState.uploadedBy.userId}
            isAdmin={isAdmin}
            handleChange={handleChange}
            status={postDataState.status}
          />
        </div>

        <PostView
          caption={postDataState.caption}
          images={postDataState.images}
          captionLine={captionLine}
        />

        <PostInteractionCount
          postId={postDataState.postId}
          likesCount={postDataState.likesCount}
          commentsCount={postDataState.commentsCount}
        />

        <PostActions
          postData={postDataState}
          isAdmin={isAdmin}
          hideComment={hideComment}
          showCommentsForSm={showCommentsForSm}
          handleChange={handleChange}
          onSave={onSavePost}
          onLike={onLikePost}
        />
      </div>
    </ViewTracker>
  );
};

export default PostListCard;
