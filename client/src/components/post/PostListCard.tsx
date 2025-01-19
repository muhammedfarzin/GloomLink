import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import ProfileImage from "../ProfileImage";
import IconButton from "../IconButton";
import HeartIcon from "../../assets/icons/Heart.svg";
import CommentIcon from "../../assets/icons/Comment.svg";
import ShareIcon from "../../assets/icons/Share.svg";
import SaveIcon from "../../assets/icons/Save.svg";
import SavedIcon from "../../assets/icons/Saved.svg";
import { Link } from "react-router-dom";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";
import { useState } from "react";
import apiClient from "@/apiClient";

export interface Post {
  _id: string;
  userId: string;
  caption: string;
  images: string[];
  tags: string[];
  publishedFor: "public" | "subscriber";
  createdAt: string;
  saved: boolean;
  uploadedBy: {
    _id: string;
    firstname: string;
    lastname: string;
    username: string;
    image: string;
  };
}

interface PostListCardProps {
  postData: Pick<Post, "_id" | "caption" | "images" | "saved" | "uploadedBy">;
}

const PostListCard: React.FC<PostListCardProps> = ({
  postData: { _id, caption, images, uploadedBy, saved },
}) => {
  const colorTheme = useSelector((state: RootState) => state.theme.colorTheme);
  const [isSaved, setIsSaved] = useState<boolean>(saved);

  const handleSavePost = async (postId: string, type: "save" | "unsave") => {
    try {
      console.log(type);
      setIsSaved(!isSaved);
      const path = type === "save" ? "posts/save/" : "posts/unsave/";
      await apiClient.put(path + postId);
    } catch (error) {
      setIsSaved(!isSaved);
    }
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
        <Link to={`/${uploadedBy.username}`}>
          <ProfileImage
            className="w-10 cursor-pointer"
            profileImage={uploadedBy.image}
          />
        </Link>
        <Link to={`/${uploadedBy.username}`}>
          <span className="text-base font-bold cursor-pointer line-clamp-1">
            {uploadedBy.username}
          </span>
        </Link>
      </div>

      {/* Post */}
      <div>
        <p className="text-base max-h-[4.5rem] transition-all duration-1000 hover:max-h-[5000px] line-clamp-3 hover:line-clamp-none">
          {caption}
        </p>

        <Carousel className="relative w-full">
          <CarouselContent>
            {images.map((image, index) => (
              <CarouselItem key={index}>
                <img
                  className="mt-1 w-full object-contain rounded-xl min-h-40 max-h-80 border"
                  src={image}
                  alt="post"
                  style={{
                    borderColor: colorTheme.border,
                    backgroundColor: colorTheme.text + "05",
                  }}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="absulute left-2 bg-transparent opacity-10 hover:opacity-100 disabled:opacity-0 hidden md:inline-flex" />
          <CarouselNext className="absulute right-2 bg-transparent opacity-10 hover:opacity-100 disabled:opacity-0 hidden md:inline-flex" />
        </Carousel>
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
            icon={isSaved ? SavedIcon : SaveIcon}
            alt="save"
            onClick={() =>
              isSaved
                ? handleSavePost(_id, "unsave")
                : handleSavePost(_id, "save")
            }
          />
        </div>
      </div>
    </div>
  );
};

export default PostListCard;
