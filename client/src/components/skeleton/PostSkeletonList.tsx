import PostSkeleton from "./PostSkeleton";

const PostSkeletonList = () => {
  return Array.from({ length: 3 }).map((_, index) => (
    <PostSkeleton key={`post-skeleton-${index}`} />
  ));
};

export default PostSkeletonList;
