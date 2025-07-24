import IconButton from "../IconButton";
import HeartIcon from "../../assets/icons/Heart.svg";
import HeartFilledIcon from "../../assets/icons/HeartFilled.svg";
import ShareIcon from "../../assets/icons/Share.svg";
import SaveIcon from "../../assets/icons/Save.svg";
import SavedIcon from "../../assets/icons/Saved.svg";
import CommentButton from "./CommentButton";
import type { Props as PostListCardProps } from "./PostListCard";
import { Post } from "./types/Post";

interface PostActionsProps {
  postData?: PostListCardProps["postData"];
  hideComment?: boolean;
  isAdmin?: boolean;
  handleLikePost?: (type: "like" | "dislike") => Promise<void>;
  handleSavePost?: (postId: string, type: "save" | "unsave") => Promise<void>;
  handleChange?: React.Dispatch<React.SetStateAction<Post[]>>;
}

const PostActions: React.FC<PostActionsProps> = ({
  postData,
  hideComment,
  isAdmin,
  handleLikePost,
  handleSavePost,
  handleChange,
}) => {
  return !isAdmin ? (
    <div className="flex justify-between w-full">
      <div
        className={`flex justify-around rounded-xl bg-[#6b728033] p-1 w-1/${
          hideComment ? "3" : "2"
        }`}
      >
        <IconButton
          icon={postData?.liked ? HeartFilledIcon : HeartIcon}
          alt="favorite"
          onClick={() =>
            postData?.liked
              ? handleLikePost?.("dislike")
              : handleLikePost?.("like")
          }
        />

        {!hideComment && postData ? (
          <CommentButton
            postId={postData._id}
            postCardData={{
              postId: postData._id,
              postData: postData,
              handleChange,
            }}
          />
        ) : null}
        <IconButton icon={ShareIcon} alt="share" />
      </div>
      <div className="p-1">
        <IconButton
          icon={postData?.saved ? SavedIcon : SaveIcon}
          alt="save"
          onClick={() =>
            postData &&
            (postData?.saved
              ? handleSavePost?.(postData._id, "unsave")
              : handleSavePost?.(postData._id, "save"))
          }
        />
      </div>
    </div>
  ) : (
    <div className="flex justify-between w-full">
      {postData?.reportCount ? (
        <div className="text-center capitalize rounded-xl bg-[#6b728033] p-1 w-1/4">
          reports: {postData?.reportCount}
        </div>
      ) : (
        <div />
      )}
      <div className="text-center capitalize rounded-xl bg-[#6b728033] p-1 w-1/4">
        {postData?.status}
      </div>
    </div>
  );
};

export default PostActions;
