import { ViewTracker } from "../ViewTracker";
import { useInteraction } from "@/hooks/useInteraction";
import { apiClient } from "@/apiClient";
import PostActionsDropDown from "./PostActionsDropDown";
import { useCallback, useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import PostActions from "./PostActions";
import { Post } from "./types/Post";
import AccountViewCard from "@/components/AccountViewCard";
import type PostDataType from "./types/PostDataType";
import PostInteractionCount from "./PostInteractionCount";
import PostView from "./PostView";
import PostSkeleton from "../skeleton/PostSkeleton";
import { formatTimeAgo } from "@/lib/dateUtils";
import { useSelector } from "react-redux";
import { type RootState } from "@/redux/store";

export interface Props {
  postId: string;
  postData?: PostDataType;
  isAdmin?: boolean;
  className?: string;
  hideComment?: boolean;
  showCommentsForSm?: boolean;
  captionLine?: number;
  handleChange?: React.Dispatch<React.SetStateAction<Post[]>>;
}

const PostListCard: React.FC<Props> = ({
  postId,
  postData,
  isAdmin = false,
  className,
  hideComment,
  showCommentsForSm,
  captionLine,
  handleChange,
}) => {
  const authId = useSelector((state: RootState) => state.auth.userData?._id);
  const { toast } = useToast();
  const { recordInteraction } = useInteraction();
  const [postDataState, setPostDataState] = useState<PostDataType | undefined>(
    postData
  );

  useEffect(() => {
    if (!postData) {
      apiClient
        .get(`/posts/${postId}`)
        .then((response) => {
          setPostDataState(response.data.postData);
        })
        .catch((error) => {
          toast({
            description: error.message || "Something went wrong",
            variant: "destructive",
          });
        });
    }
  }, [postData]);

  const onSavePost = useCallback(
    (isSaved: boolean) =>
      postDataState && setPostDataState({ ...postDataState, isSaved }),
    [postDataState, setPostDataState]
  );

  const onLikePost = useCallback(
    (isLiked: boolean, count?: number) =>
      postDataState &&
      setPostDataState({
        ...postDataState,
        isLiked,
        likesCount: count,
      }),
    [postDataState, setPostDataState]
  );

  const handleView = useCallback(() => {
    if (postDataState && postDataState.uploadedBy._id !== authId) {
      recordInteraction(postDataState._id, "view");
    }
  }, [postDataState, recordInteraction, authId]);

  if (!postDataState)
    return <PostSkeleton className="h-full rounded-s-lg rounded-e-none" />;

  return (
    <ViewTracker onView={handleView}>
      <div
        className={`flex flex-col gap-3 border bg-primary border-[#9ca3af33] p-4 w-full max-w-lg ${
          className || "rounded-2xl"
        }`}
      >
        {/* Uploaded By */}
        <div className="flex justify-between">
          <AccountViewCard userData={postDataState.uploadedBy}>
            <span className="text-xs text-gray-500 mt-0">
              {formatTimeAgo(postDataState.createdAt)}
            </span>
          </AccountViewCard>

          <PostActionsDropDown
            postId={postDataState._id}
            userId={postDataState.uploadedBy._id}
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
          postId={postDataState._id}
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
