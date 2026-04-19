import { Link } from "react-router-dom";
import ProfileImage from "./ProfileImage";
import type { Post } from "../features/types/Post";

interface Props {
  userData: Pick<Post["uploadedBy"], "username" | "imageUrl">;
  children?: React.ReactNode;
}

const AccountViewCard: React.FC<Props> = ({ userData, children }) => {
  return (
    <div className="flex flex-row items-center">
      <Link to={`/${userData.username}`}>
        <ProfileImage
          className="w-10 cursor-pointer"
          profileImage={userData.imageUrl}
        />
      </Link>

      <div className="flex flex-col">
        <Link to={`/${userData.username}`}>
          <span className="text-base font-bold cursor-pointer line-clamp-1">
            {userData.username}
          </span>
        </Link>
        {children}
      </div>
    </div>
  );
};

export default AccountViewCard;
