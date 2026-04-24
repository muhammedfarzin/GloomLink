import IconButton from "@/components/IconButton";
import HeartIcon from "@/assets/icons/Heart.svg";
import HeartFilledIcon from "@/assets/icons/HeartFilled.svg";
import ShareIcon from "@/assets/icons/Share.svg";
import SaveIcon from "@/assets/icons/Save.svg";
import SavedIcon from "@/assets/icons/Saved.svg";
import CommentButton from "../CommentButton";
import { Props as PostActionsProps } from ".";
import DialogBox from "@/components/DialogBox";
import ShareList from "@/features/chat/ShareList";
import { Flag, Activity } from "lucide-react";

interface Props extends PostActionsProps {
  handleLikePost?: (type: "like" | "unlike") => Promise<void>;
  handleSavePost?: (postId: string) => Promise<void>;
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
    <div className="flex justify-between items-center w-full mt-2">
      <div
        className={[
          "flex items-center justify-around rounded-2xl bg-primary/20 border border-primary/10 p-1.5 shadow-sm backdrop-blur-md transition-all duration-300",
          hideComment
            ? `${showCommentsForSm ? "w-1/2 md:" : ""}w-[40%]`
            : "w-[50%]",
        ].join(" ")}
      >
        <div className="hover:bg-primary/40 rounded-xl p-1.5 transition-colors cursor-pointer group flex items-center justify-center">
          <IconButton
            icon={postData?.isLiked ? HeartFilledIcon : HeartIcon}
            alt="favorite"
            onClick={() =>
              handleLikePost?.(postData?.isLiked ? "unlike" : "like")
            }
          />
        </div>

        {(hideComment && !showCommentsForSm) || (
          <div className={`hover:bg-primary/40 rounded-xl p-1.5 transition-colors cursor-pointer group flex items-center justify-center ${hideComment && showCommentsForSm ? "md:hidden" : ""}`}>
            <CommentButton
              postId={postData.postId}
              postCardData={{
                postId: postData.postId,
                postData: postData,
                handleChange,
              }}
            />
          </div>
        )}

        <div className="hover:bg-primary/40 rounded-xl p-1.5 transition-colors cursor-pointer group flex items-center justify-center">
          <DialogBox
            dialogElement={
              <ShareList data={{ message: postData.postId, type: "post" }} />
            }
            title="Share post"
          >
            <IconButton icon={ShareIcon} alt="share" />
          </DialogBox>
        </div>
      </div>
      <div className="p-2 rounded-2xl bg-primary/20 border border-primary/10 hover:bg-primary/40 transition-colors cursor-pointer shadow-sm backdrop-blur-md group flex items-center justify-center">
        <IconButton
          icon={postData?.isSaved ? SavedIcon : SaveIcon}
          alt="save"
          onClick={() => postData && handleSavePost?.(postData.postId)}
        />
      </div>
    </div>
  ) : (
    <div className="flex items-center gap-3 w-full mt-2">
      {!!postData?.reportCount && (
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-orange-500/20 text-orange-400 border border-orange-500/30 shadow-[0_0_10px_rgba(249,115,22,0.2)]">
          <Flag size={14} />
          <span>{postData.reportCount} Reports</span>
        </div>
      )}
      <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold capitalize transition-all ${
        postData?.status === "active" 
          ? "bg-green-500/20 text-green-400 border border-green-500/30 shadow-[0_0_10px_rgba(34,197,94,0.2)]" 
          : postData?.status === "blocked" 
          ? "bg-red-500/20 text-red-400 border border-red-500/30 shadow-[0_0_10px_rgba(239,68,68,0.2)]" 
          : "bg-gray-500/20 text-gray-400 border border-gray-500/30"
      }`}>
        <Activity size={14} />
        <span>{postData?.status}</span>
      </div>
    </div>
  );
};

export default PostActionsView;
