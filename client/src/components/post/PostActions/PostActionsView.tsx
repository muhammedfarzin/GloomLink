import IconButton from "@/components/IconButton";
import HeartIcon from "@/assets/icons/Heart.svg";
import HeartFilledIcon from "@/assets/icons/HeartFilled.svg";
import ShareIcon from "@/assets/icons/Share.svg";
import SaveIcon from "@/assets/icons/Save.svg";
import SavedIcon from "@/assets/icons/Saved.svg";
import CommentButton from "../CommentButton";
import { Props as PostActionsProps } from ".";
import DialogBox from "@/components/DialogBox";
import ShareList from "@/components/ShareList";

interface Props extends PostActionsProps {
  handleLikePost?: (type: "like" | "unlike") => Promise<void>;
  handleSavePost?: (postId: string, type: "save" | "unsave") => Promise<void>;
}

const PostActionsView: React.FC<Props> = ({
  postData,
  hideComment,
  showCommentsForSm,
  isAdmin,
  handleLikePost,
  handleSavePost,
  handleChange,
}) => {
  return !isAdmin ? (
    <div className="flex justify-between w-full">
      <div
        className={[
          "flex justify-around rounded-xl bg-[#6b728033] p-1",
          hideComment
            ? `${showCommentsForSm ? "w-1/2 md:" : ""}w-1/3`
            : "w-1/2",
        ].join(" ")}
      >
        <IconButton
          icon={postData?.liked ? HeartFilledIcon : HeartIcon}
          alt="favorite"
          onClick={() => handleLikePost?.(postData?.liked ? "unlike" : "like")}
        />

        {(hideComment && !showCommentsForSm) || (
          <CommentButton
            className={hideComment && showCommentsForSm ? "md:hidden" : ""}
            postId={postData._id}
            postCardData={{
              postId: postData._id,
              postData: postData,
              handleChange,
            }}
          />
        )}

        <DialogBox
          dialogElement={
            <ShareList data={{ message: postData._id, type: "post" }} />
          }
          title="Share post"
        >
          <IconButton icon={ShareIcon} alt="share" />
        </DialogBox>
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

export default PostActionsView;
