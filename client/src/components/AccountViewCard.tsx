import { Link } from "react-router-dom";
import ProfileImage from "./ProfileImage";
import { Post } from "./post/types/Post";

interface Props {
  userData: Pick<Post["uploadedBy"], "username" | "image">;
}

const AccountViewCard: React.FC<Props> = ({ userData }) => {
  return (
    <div className="flex flex-row items-center">
      <Link to={`/${userData.username}`}>
        <ProfileImage
          className="w-10 cursor-pointer"
          profileImage={userData.image}
        />
      </Link>
      <Link to={`/${userData.username}`}>
        <span className="text-base font-bold cursor-pointer line-clamp-1">
          {userData.username}
        </span>
      </Link>
    </div>
  );
};

export default AccountViewCard;
