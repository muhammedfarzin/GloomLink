import UserListDialogButton from "./UserListDialogButton";

interface Props {
  userId: string;
  followCount: number;
  type: "followers" | "following";
}

const FollowDialogButton: React.FC<Props> = ({ userId, followCount, type }) => {
  return (
    <UserListDialogButton
      apiUrl={`/profile/follow/${userId}/${type}`}
      title={type}
    >
      <div className="flex flex-col justify-center text-center cursor-pointer">
        <span className="text-xl font-bold">{followCount}</span>
        <span className="text-sm font-light capitalize">{type}</span>
      </div>
    </UserListDialogButton>
  );
};

export default FollowDialogButton;
