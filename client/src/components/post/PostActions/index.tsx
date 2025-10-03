import { apiClient } from "@/apiClient";
import { Post } from "../types/Post";
import PostActionsView from "./PostActionsView";
import PostDataType from "../types/PostDataType";
import { useToast } from "@/hooks/use-toast";

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
  const { toast } = useToast();

  const handleSavePost = async (postId: string) => {
    const handleSavedState = (state: Post[]) =>
      state.map((post) => {
        if (post._id === postId) post.isSaved = !postData.isSaved;
        return post;
      });
    try {
      if (!handleChange && postData) onSave?.(!postData.isSaved);
      handleChange?.(handleSavedState);
      const response = await apiClient.post(`/posts/save/${postId}`);
      toast({ description: response.data.message });
    } catch (error) {
      if (!handleChange && postData) onSave?.(!!postData.isSaved);
      handleChange?.(handleSavedState);
      toast({ description: (error as any).message, variant: "destructive" });
    }
  };

  const handleLikePost = async (type: "like" | "unlike") => {
    const handleLikedState = (state: Post[]) =>
      state.map((post) => {
        if (post._id === postData._id) {
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
      await apiClient.post(`/likes/post/${postData._id}`);
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
