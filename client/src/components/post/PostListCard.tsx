import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import ProfileImage from "../ProfileImage";
import IconButton from "../IconButton";
import HeartIcon from "../../assets/icons/Heart.svg";
import HeartFilledIcon from "../../assets/icons/HeartFilled.svg";
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
import apiClient from "@/apiClient";
import PostActionsDropDown from "./PostActionsDropDown";
import CommentButton from "./CommentButton";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";

export interface Post {
  _id: string;
  userId: string;
  caption: string;
  images: string[];
  tags: string[];
  publishedFor: "public" | "subscriber";
  createdAt: string;
  saved?: boolean;
  liked?: boolean;
  status?: "active" | "blocked" | "deleted";
  uploadedBy: {
    _id: string;
    firstname: string;
    lastname: string;
    username: string;
    image?: string;
  };
  reportCount?: number;
}

export interface PostListCardProps {
  postId: string;
  postData?: Pick<
    Post,
    | "_id"
    | "caption"
    | "images"
    | "saved"
    | "liked"
    | "uploadedBy"
    | "status"
    | "reportCount"
  >;
  isAdmin?: boolean;
  handleChange?: React.Dispatch<React.SetStateAction<Post[]>>;
  className?: string;
  hideComment?: boolean;
  captionLine?: number;
}

const PostListCard: React.FC<PostListCardProps> = ({
  postId,
  postData,
  isAdmin = false,
  handleChange,
  className,
  hideComment,
  captionLine = 3,
}) => {
  const colorTheme = useSelector((state: RootState) => state.theme.colorTheme);
  const { toast } = useToast();
  const [postDataState, setPostDataState] =
    useState<PostListCardProps["postData"]>(postData);

  useEffect(() => {
    if (!postData) {
      apiClient
        .get(`/posts/${postId}`)
        .then((response) => {
          setPostDataState(response.data);
        })
        .catch((error) => {
          toast({
            description:
              error.response?.data?.message ||
              error.message ||
              "Something went wrong",
            variant: "destructive",
          });
        });
    }
  }, [postData]);

  const handleSavePost = async (postId: string, type: "save" | "unsave") => {
    const handleSavedState = (state: Post[]) =>
      state.map((post) => {
        if (post._id === postId) post.saved = !saved;
        return post;
      });
    try {
      if (!handleChange && postDataState)
        setPostDataState({ ...postDataState, saved: !postDataState?.saved });
      handleChange?.(handleSavedState);
      await apiClient.put(`/posts/${type}/${postId}`);
    } catch (error) {
      if (!handleChange && postDataState)
        setPostDataState({ ...postDataState, saved: postDataState?.saved });
      handleChange?.(handleSavedState);
    }
  };

  const handleLikePost = async (type: "like" | "dislike") => {
    const handleLikedState = (state: Post[]) =>
      state.map((post) => {
        if (post._id === _id) post.liked = !liked;
        return post;
      });
    try {
      if (!handleChange && postDataState)
        setPostDataState({ ...postDataState, liked: !postDataState?.liked });
      handleChange?.(handleLikedState);
      await apiClient.put(`/posts/${type}/${_id}`);
    } catch (error) {
      if (!handleChange && postDataState)
        setPostDataState({ ...postDataState, liked: postDataState?.liked });
      handleChange?.(handleLikedState);
    }
  };

  if (!postDataState) return null;

  const {
    _id,
    caption,
    images,
    uploadedBy,
    saved = false,
    liked = false,
    status = "active",
    reportCount,
  } = postDataState;

  return (
    <div
      className={`flex flex-col gap-3 border border-[#9ca3af33] p-4 w-full max-w-lg ${
        className || "rounded-2xl"
      }`}
      style={{
        backgroundColor: colorTheme.primary,
      }}
    >
      {/* Uploaded By */}
      <div className="flex justify-between">
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
        <PostActionsDropDown
          postId={_id}
          isAdmin={isAdmin}
          handleChange={handleChange}
          status={status}
        />
      </div>

      {/* Post */}
      <div className="h-full overflow-y-scroll no-scrollbar">
        <p
          className={`text-base max-h-[4.5rem] transition-all duration-1000 hover:max-h-[5000px] line-clamp-${captionLine} hover:line-clamp-none`}
        >
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
      {!isAdmin ? (
        <div className="flex justify-between w-full">
          <div
            className={`flex justify-around rounded-xl bg-[#6b728033] p-1 w-1/${
              hideComment ? "3" : "2"
            }`}
          >
            <IconButton
              icon={liked ? HeartFilledIcon : HeartIcon}
              alt="favorite"
              onClick={() =>
                liked ? handleLikePost("dislike") : handleLikePost("like")
              }
            />

            {!hideComment ? (
              <CommentButton
                postId={_id}
                postCardData={{
                  postId: postId,
                  postData: {
                    _id,
                    caption,
                    images,
                    uploadedBy,
                    saved,
                    status,
                    reportCount,
                  },
                  handleChange,
                }}
              />
            ) : null}
            <IconButton icon={ShareIcon} alt="share" />
          </div>
          <div className="p-1">
            <IconButton
              icon={saved ? SavedIcon : SaveIcon}
              alt="save"
              onClick={() =>
                saved
                  ? handleSavePost(_id, "unsave")
                  : handleSavePost(_id, "save")
              }
            />
          </div>
        </div>
      ) : (
        <div className="flex justify-between w-full">
          {reportCount ? (
            <div className="text-center capitalize rounded-xl bg-[#6b728033] p-1 w-1/4">
              reports: {reportCount}
            </div>
          ) : (
            <div />
          )}
          <div className="text-center capitalize rounded-xl bg-[#6b728033] p-1 w-1/4">
            {status}
          </div>
        </div>
      )}
    </div>
  );
};

export default PostListCard;
