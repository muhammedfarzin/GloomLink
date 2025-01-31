import ProfileImage from "../ProfileImage";
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
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import PostActions from "./PostActions";
import DialogBox from "../DialogBox";
import UsersList from "../UsersList";

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
  likesCount?: number;
  commentsCount?: number;
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
    | "likesCount"
    | "commentsCount"
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
        if (post._id === _id) {
          post.liked = !liked;
          if (!post.likesCount) {
            post.likesCount = type === "like" ? 1 : post.likesCount;
          } else if (type === "like") post.likesCount += 1;
          else post.likesCount -= 1;
        }

        return post;
      });
    try {
      if (!handleChange && postDataState)
        setPostDataState({
          ...postDataState,
          liked: !postDataState?.liked,
          likesCount:
            (postDataState?.likesCount || 0) + (type === "like" ? 1 : -1),
        });
      handleChange?.(handleLikedState);
      await apiClient.put(`/posts/${type}/${_id}`);
    } catch (error) {
      if (!handleChange && postDataState)
        setPostDataState({
          ...postDataState,
          liked: postDataState?.liked,
          likesCount: postDataState?.likesCount,
        });
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
    likesCount,
    commentsCount,
  } = postDataState;

  return (
    <div
      className={`flex flex-col gap-3 border bg-primary border-[#9ca3af33] p-4 w-full max-w-lg ${
        className || "rounded-2xl"
      }`}
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
          userId={uploadedBy._id}
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
                  className="mt-1 w-full bg-foreground/5 border-border object-contain rounded-xl min-h-40 max-h-80 border"
                  src={image}
                  alt="post"
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="absulute left-2 bg-transparent opacity-10 hover:opacity-100 disabled:opacity-0 hidden md:inline-flex" />
          <CarouselNext className="absulute right-2 bg-transparent opacity-10 hover:opacity-100 disabled:opacity-0 hidden md:inline-flex" />
        </Carousel>
      </div>

      {likesCount || commentsCount ? (
        <div className="relative h-2">
          <div className="absolute bottom-[-0.3rem]">
            {likesCount ? (
              <DialogBox
                dialogElement={
                  <UsersList apiUrl={`/posts/${_id}/likes`} title="users" />
                }
                title="Liked by"
              >
                <span className="cursor-pointer">{`${likesCount} likes`}</span>
              </DialogBox>
            ) : null}
            {likesCount && commentsCount ? " • " : null}
            {commentsCount ? `${commentsCount} comments` : null}
          </div>
        </div>
      ) : null}

      <PostActions
        postData={postDataState}
        isAdmin={isAdmin}
        hideComment={hideComment}
        handleChange={handleChange}
        handleLikePost={handleLikePost}
        handleSavePost={handleSavePost}
      />
    </div>
  );
};

export default PostListCard;
