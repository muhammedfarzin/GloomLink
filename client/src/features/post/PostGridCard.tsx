import React from "react";
import { Link, useLocation } from "react-router-dom";

interface PostGridCardProps {
  image?: string;
  caption?: string;
  postId: string;
}

const PostGridCard: React.FC<PostGridCardProps> = ({
  image,
  caption,
  postId,
}) => {
  const location = useLocation();

  return (
    <Link
      to={`/post/${postId}`}
      state={{ backgroundLocation: location }}
      className="border rounded-md md:rounded-3xl cursor-pointer hover:scale-105 transition-all border-border aspect-square w-[calc(33.73%-0.5rem)]"
    >
      {image ? (
        <img
          className="rounded-md md:rounded-3xl h-full w-full object-cover"
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
    </Link>
  );
};

export default PostGridCard;
