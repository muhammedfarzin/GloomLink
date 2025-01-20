import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import ProfileImage from "../ProfileImage";
import { Link } from "react-router-dom";

interface CommentListCardProps {
  profileImage?: string;
  username: string;
  comment: string;
}

const CommentListCard: React.FC<CommentListCardProps> = ({
  profileImage,
  username,
  comment,
}) => {
  const colorTheme = useSelector((state: RootState) => state.theme.colorTheme);

  return (
    <div
      className="flex p-2 rounded-lg items-start"
      style={{ backgroundColor: colorTheme.primary }}
    >
      <Link to={`/${username}`}>
        <ProfileImage className="w-10" profileImage={profileImage} />
      </Link>

      <div className="w-full">
        <Link to={`/${username}`} className="text-sm font-bold m-0">
          {username}
        </Link>
        <p
          tabIndex={0}
          className="line-clamp-3 focus:line-clamp-none max-h-[4.5rem] transition-all duration-1000 focus:max-h-[5000px]"
        >
          {comment}
        </p>
      </div>
    </div>
  );
};

export default CommentListCard;
