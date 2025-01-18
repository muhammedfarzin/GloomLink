import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

interface PostGridCardProps {
  image?: string;
  caption?: string;
}

const PostGridCard: React.FC<PostGridCardProps> = ({ image, caption }) => {
  const colorTheme = useSelector((state: RootState) => state.theme.colorTheme);

  return (
    <div
      className="border rounded-3xl cursor-pointer aspect-square w-[calc(33.73%-0.5rem)]"
      style={{ borderColor: colorTheme.border }}
    >
      {image ? (
        <img
          className="rounded-3xl h-full w-full object-cover"
          src={image}
          alt="post"
        />
      ) : (
        <div className="flex justify-center items-center h-full w-full">
          <span
            className="line-clamp-6 p-3 max-h-[70%] text-center"
            title={caption}
          >
            {caption}
          </span>
        </div>
      )}
    </div>
  );
};

export default PostGridCard;
