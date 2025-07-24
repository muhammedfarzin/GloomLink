import apiClient from "@/apiClient";
import PostActionsDropDown from "./PostActionsDropDown";
import { useCallback, useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import PostActions from "./PostActions";
import { Post } from "./types/Post";
import AccountViewCard from "@/components/AccountViewCard";
import type PostDataType from "./types/PostDataType";
import PostInteractionCount from "./PostInteractionCount";
import PostView from "./PostView";

export interface Props {
  postId: string;
  postData?: PostDataType;
  isAdmin?: boolean;
  handleChange?: React.Dispatch<React.SetStateAction<Post[]>>;
  className?: string;
  hideComment?: boolean;
  captionLine?: number;
}

const PostListCard: React.FC<Props> = ({
  postId,
  postData,
  isAdmin = false,
  handleChange,
  className,
  hideComment,
  captionLine,
}) => {
  const { toast } = useToast();
  const [postDataState, setPostDataState] = useState<PostDataType | undefined>(
    postData
  );

  useEffect(() => {
    if (!postData) {
      apiClient
        .get(`/posts/${postId}`)
        .then((response) => {
          setPostDataState(response.data);
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
    }
  }, [postData]);

  if (!postDataState) return null;

  const onSavePost = useCallback(
    (isSaved: boolean) =>
      setPostDataState({ ...postDataState, saved: isSaved }),
    [postDataState, setPostDataState]
  );

  const onLikePost = useCallback(
    (isLiked: boolean, count?: number) =>
      setPostDataState({
        ...postDataState,
        liked: isLiked,
        likesCount: count,
      }),
    [postDataState, setPostDataState]
  );

  return (
    <div
      className={`flex flex-col gap-3 border bg-primary border-[#9ca3af33] p-4 w-full max-w-lg ${
        className || "rounded-2xl"
      }`}
    >
      {/* Uploaded By */}
      <div className="flex justify-between">
        <AccountViewCard userData={postDataState.uploadedBy} />

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
        handleChange={handleChange}
        onSave={onSavePost}
        onLike={onLikePost}
      />
    </div>
  );
};

export default PostListCard;
