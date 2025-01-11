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
      <img
        className="rounded-3xl h-full w-full object-cover"
        src={
          image ||
          "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcRzEVWlSuxRzKVINDVaP0wDm2mh2ENug28zEJXK54vPfTgJg54A"
        }
        alt="post"
      />
    </div>
  );
};

export default PostGridCard;
