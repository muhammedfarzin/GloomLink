import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import ProfileImage from "../ProfileImage";
import { Link } from "react-router-dom";

export interface Comment {
  _id: string;
  comment: string;
  targetId: string;
  userId: string;
  type: "post";
  uploadedBy: {
    _id: string;
    firstname: string;
    lastname: string;
    username: string;
    image?: string;
  };
}

interface CommentListCardProps {
  comment: Comment["comment"];
  username: Comment["uploadedBy"]["username"];
  image: Comment["uploadedBy"]["image"];
}

const CommentListCard: React.FC<CommentListCardProps> = ({
  comment,
  image,
  username,
}) => {
  const colorTheme = useSelector((state: RootState) => state.theme.colorTheme);

  return (
    <div
      className="flex p-2 rounded-lg items-start"
      style={{ backgroundColor: colorTheme.primary }}
    >
      <Link to={`/${username}`}>
        <ProfileImage className="w-10" profileImage={image} />
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
