import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import ProfileImage from "../ProfileImage";
import IconButton from "../IconButton";
import HeartIcon from "../../assets/icons/Heart.svg";
import CommentIcon from "../../assets/icons/Comment.svg";
import ShareIcon from "../../assets/icons/Share.svg";
import SavedIcon from "../../assets/icons/Saved.svg";
import { Link } from "react-router-dom";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";
import apiClient from "@/apiClient";

const BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

const PostListCard: React.FC = () => {
  const colorTheme = useSelector((state: RootState) => state.theme.colorTheme);

  const handleSavePost = (postId: string) => {
    apiClient.put(`${BASE_URL}/user/posts/save/${postId}`);
  };

  return (
    <div
      className="flex flex-col gap-3 border border-[#9ca3af33] p-4 w-full max-w-lg rounded-2xl"
      style={{
        backgroundColor: colorTheme.primary,
      }}
    >
      {/* Uploaded By */}
      <div className="flex flex-row items-center">
        <Link to={"/username"}>
          <ProfileImage className="w-10 cursor-pointer" />
        </Link>
        <Link to={"/username"}>
          <span className="text-base font-bold cursor-pointer">username</span>
        </Link>
      </div>

      {/* Post */}
      <div>
        <p className="text-sm font-normal">Caption</p>

        <Carousel className="relative w-full">
          <CarouselContent>
            {Array.from({ length: 5 }).map((_, index) => (
              <CarouselItem key={index}>
                <img
                  className="mt-1 w-full rounded-xl"
                  src="https://gratisography.com/wp-content/uploads/2024/10/gratisography-cool-cat-800x525.jpg"
                  alt="post"
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="absulute left-2 bg-transparent opacity-10 hover:opacity-100 disabled:opacity-0 hidden md:inline-flex" />
          <CarouselNext className="absulute right-2 bg-transparent opacity-10 hover:opacity-100 disabled:opacity-0 hidden md:inline-flex" />
        </Carousel>
        {/* <img
          className="mt-1 w-full rounded-xl"
          src="https://gratisography.com/wp-content/uploads/2024/10/gratisography-cool-cat-800x525.jpg"
          alt="post"
        /> */}
      </div>

      {/* Post Actions */}
      <div className="flex justify-between w-full">
        <div className="flex justify-around rounded-xl bg-[#6b728033] p-1 w-1/2">
          <IconButton icon={HeartIcon} alt="favorite" />
          <IconButton icon={CommentIcon} alt="comment" />
          <IconButton icon={ShareIcon} alt="share" />
        </div>
        <div className="p-1">
          <IconButton
            icon={SavedIcon}
            alt="save"
            onClick={() => handleSavePost("postId")}
          />
        </div>
      </div>
    </div>
  );
};

export default PostListCard;
