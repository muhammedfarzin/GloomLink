import { useToast } from "@/hooks/use-toast";
import { useCallback, useEffect, useRef, useState } from "react";
import throttle from "lodash/throttle";
import { Post } from "./types/Post";
import apiClient from "@/apiClient";
import PostListCard from "./PostListCard";
import PostSkeleton from "../skeleton/PostSkeleton";
import EmptyIllustrationDark from "../../assets/images/Empty-Illustration-Dark.svg";

interface Props {
  apiUrl: string;
  emptyLabel?: string;
}

const PostFeed: React.FC<Props> = ({ apiUrl, emptyLabel }) => {
  const pageRef = useRef(1);
  const containerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  const fetchPost = useCallback(async () => {
    try {
      const response = await apiClient.get(`${apiUrl}?page=${pageRef.current}`);
      setPosts((prevState) => [
        ...prevState,
        ...(response.data.posts as Post[]),
      ]);
      pageRef.current++;
      setIsEnd(response.data.isEnd);
    } catch (error: any) {
      toast({
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [apiClient, apiUrl, pageRef, setIsEnd]);

  useEffect(() => {
    if (loading && !isEnd) fetchPost();
  }, [loading]);

  useEffect(() => {
    const handleScroll = throttle(() => {
      if (
        containerRef.current &&
        containerRef.current.scrollHeight - containerRef.current.scrollTop <=
          window.innerHeight * 2 &&
        !isEnd
      ) {
        setLoading(true);
      }
    }, 300);

    containerRef.current?.addEventListener("scroll", handleScroll);
    return () =>
      containerRef.current?.removeEventListener("scroll", handleScroll);
  }, [isEnd]);

  return (
    <div ref={containerRef} className="overflow-y-scroll no-scrollbar h-screen">
      <div className="flex flex-col items-center gap-2 mt-5">
        {posts.map((post) => (
          <PostListCard
            key={post._id}
            postId={post._id}
            postData={post}
            handleChange={setPosts}
          />
        ))}

        {loading
          ? Array.from({ length: 3 }).map((_, index) => (
              <PostSkeleton key={`post-skeleton-${index}`} />
            ))
          : !posts.length && (
              <div className="flex flex-col justify-center items-center w-full h-screen">
                <img
                  src={EmptyIllustrationDark}
                  alt="empty"
                  className="w-96 max-w-full"
                />
                <span className="text-xl font-bold">
                  {emptyLabel ?? "There is no post to show!"}
                </span>
              </div>
            )}

        {isEnd && (
          <p className="my-10 text-center">
            <svg
              viewBox="0 0 24 24"
              className="fill-primary w-14 mx-auto"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 2C6.49 2 2 6.49 2 12C2 17.51 6.49 22 12 22C17.51 22 22 17.51 22 12C22 6.49 17.51 2 12 2ZM16.78 9.7L11.11 15.37C10.97 15.51 10.78 15.59 10.58 15.59C10.38 15.59 10.19 15.51 10.05 15.37L7.22 12.54C6.93 12.25 6.93 11.77 7.22 11.48C7.51 11.19 7.99 11.19 8.28 11.48L10.58 13.78L15.72 8.64C16.01 8.35 16.49 8.35 16.78 8.64C17.07 8.93 17.07 9.4 16.78 9.7Z" />
            </svg>
            You’ve reached the end—no more posts to show!
          </p>
        )}
      </div>
    </div>
  );
};

export default PostFeed;
