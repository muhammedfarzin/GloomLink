import UserListDialogButton from "../profile/UserListDialogButton";

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
          <UserListDialogButton apiUrl={`/likes/post/${postId}`} title="users">
            <span className="cursor-pointer">{`${likesCount} likes`}</span>
          </UserListDialogButton>
        ) : null}
        {likesCount && commentsCount ? " • " : null}
        {commentsCount ? `${commentsCount} comments` : null}
      </div>
    </div>
  ) : null;
};

export default PostInteractionCount;
