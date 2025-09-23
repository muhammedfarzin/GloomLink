import DialogBox from "../DialogBox";
import UsersList from "../UsersList";

interface Props {
  postId: string;
  likesCount?: number;
  commentsCount?: number;
}

const PostInteractionCount: React.FC<Props> = ({
  postId,
  likesCount,
  commentsCount,
}) => {
  return likesCount || commentsCount ? (
    <div className="relative h-2">
      <div className="absolute bottom-[-0.3rem]">
        {likesCount ? (
          <DialogBox
            dialogElement={
              <UsersList apiUrl={`/likes/post/${postId}`} title="users" />
            }
            title="Liked by"
          >
            <span className="cursor-pointer">{`${likesCount} likes`}</span>
          </DialogBox>
        ) : null}
        {likesCount && commentsCount ? " • " : null}
        {commentsCount ? `${commentsCount} comments` : null}
      </div>
    </div>
  ) : null;
};

export default PostInteractionCount;
