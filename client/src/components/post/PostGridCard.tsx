import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

interface PostGridCardProps {
  image?: string;
}

const PostGridCard: React.FC<PostGridCardProps> = ({ image }) => {
  const colorTheme = useSelector((state: RootState) => state.theme.colorTheme);

  return (
    <div
      className="border rounded-3xl cursor-pointer aspect-square w-[calc(33.73%-0.5rem)]"
      style={{ borderColor: colorTheme.border }}
    >
      {image ?<img
        className="rounded-3xl h-full w-full object-cover"
        src={image}
        alt="post"
      /> : <span>Text</span>}
    </div>
  );
};

export default PostGridCard;
