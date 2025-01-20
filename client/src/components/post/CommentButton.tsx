import IconButton from "../IconButton";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import CommentIcon from "@/assets/icons/Comment.svg";
import PostListCard, { type PostListCardProps } from "./PostListCard";
import InputBox from "../InputBox";
import PaperPlaneIcon from "@/assets/icons/PaperPlane.svg";
import CommentListCard from "./CommentListCard";

interface CommentButtonProps {
  postCardData: PostListCardProps;
}

const CommentButton: React.FC<CommentButtonProps> = ({ postCardData }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <IconButton icon={CommentIcon} alt="comment" />
      </DialogTrigger>
      <DialogContent className="w-full max-w-[1000px] h-screen md:h-[82vh] p-0">
        <div className="flex">
          {/* Post Card */}
          <div className="hidden md:block w-1/2 h-screen md:h-[82vh]">
            <PostListCard className="h-full rounded-s-lg" hideComment captionLine={1} {...postCardData} />
          </div>

          {/* Comment Box */}
          <div className="w-full md:w-1/2 h-full">
            <h3 className="text-lg font-bold my-2 mx-4">Comments</h3>
            <div className="px-4 overflow-y-scroll no-scrollbar">
              <div className="flex flex-col gap-2 w-full h-[calc(100vh-6.35rem)] md:h-[calc(82vh-6.35rem)]">
                {[1, 2, 3, 3, 3].map(() => (
                  <CommentListCard
                    username="usernamehere"
                    comment="Lorem ipsum, dolor sit amet consectetur adipisicing elit. Modi
          obcaecati debitis dolore ex laborum perferendis illo possimus tempore,
          necessitatibus deserunt praesentium. Nisi quam consequuntur, quos odit
          exercitationem repellat sed. Minus!"
                  />
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2 w-full border-t border-[#6b728033] py-1 px-2">
              <InputBox type="text" placeholder="Add a comment..." />
              <IconButton icon={PaperPlaneIcon} alt="send" />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CommentButton;
