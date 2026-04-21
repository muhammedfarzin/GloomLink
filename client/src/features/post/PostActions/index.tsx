import { apiClient } from "@/apiClient";
import PostActionsView from "./PostActionsView";
import { useToaster } from "@/hooks/useToaster";
import type { Post } from "../../types/Post";
import type PostDataType from "../../types/PostDataType";

export interface Props {
  postData: PostDataType;
  hideComment?: boolean;
  showCommentsForSm?: boolean;
  isAdmin?: boolean;
  handleChange?: React.Dispatch<React.SetStateAction<Post[]>>;
  onSave?: (isSaved: boolean) => void;
  onLike?: (isLiked: boolean, count?: number) => void;
}

const PostActions: React.FC<Props> = ({
  postData,
  hideComment,
  showCommentsForSm,
  isAdmin,
  handleChange,
  onSave,
  onLike,
}) => {
  const { toastMessage, toastError } = useToaster();

  const handleSavePost = async (postId: string) => {
    const handleSavedState = (state: Post[]) =>
      state.map((post) => {
        if (post.postId === postId) post.isSaved = !postData.isSaved;
        return post;
      });
    try {
      if (!handleChange && postData) onSave?.(!postData.isSaved);
      handleChange?.(handleSavedState);
      const response = await apiClient.post(`/posts/save/${postId}`);
      toastMessage(response.data.message);
    } catch (error) {
      if (!handleChange && postData) onSave?.(!!postData.isSaved);
      handleChange?.(handleSavedState);
      toastError((error as any).message);
    }
  };

  const handleLikePost = async (type: "like" | "unlike") => {
    const handleLikedState = (state: Post[]) =>
      state.map((post) => {
        if (post.postId === postData.postId) {
          post.isLiked = !postData.isLiked;
          if (!post.likesCount) {
            post.likesCount = type === "like" ? 1 : post.likesCount;
          } else if (type === "like") post.likesCount += 1;
          else post.likesCount -= 1;
        }

        return post;
      });
    try {
      if (!handleChange && postData) {
        const likeCount =
          (postData.likesCount || 0) + (type === "like" ? 1 : -1);

        onLike?.(!postData.isLiked, likeCount);
      }

      handleChange?.(handleLikedState);
      await apiClient.post(`/likes/post/${postData.postId}`);
    } catch (error) {
      if (!handleChange && postData)
        onLike?.(!!postData.isLiked, postData.likesCount);
      handleChange?.(handleLikedState);
    }
  };

  return (
    <PostActionsView
      postData={postData}
      hideComment={hideComment}
      showCommentsForSm={showCommentsForSm}
      isAdmin={isAdmin}
      handleLikePost={handleLikePost}
      handleSavePost={handleSavePost}
      handleChange={handleChange}
    />
  );
};

export default PostActions;
