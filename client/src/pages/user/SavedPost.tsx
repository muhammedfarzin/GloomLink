import { useEffect, useState } from "react";
import PostListCard, { type Post } from "../../components/post/PostListCard";
import apiClient from "@/apiClient";
import EmptyIllustrationDark from "../../assets/images/Empty-Illustration-Dark.svg";
import { useToast } from "@/hooks/use-toast";

const SavedPost = () => {
  const { toast } = useToast();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<string | null>("Loading...");

  useEffect(() => {
    setLoading("Loading...");
    apiClient
      .get("/posts/saved")
      .then((response) => {
        setPosts(response.data as Post[]);
      })
      .catch((error) => {
        toast({
          description:
            error.response.data.message ||
            error.message ||
            "Something went wrong",
          variant: "destructive",
        });
      })
      .finally(() => setLoading(null));
  }, []);

  return (
    <div className="m-auto max-w-[704px]">
      <div className="m-2">
        {posts.length ? (
          <div className="flex flex-col items-center gap-2 mt-5">
            {posts.map((post) => (
              <PostListCard key={post._id} postData={post} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col justify-center items-center w-full h-screen">
            {loading ? (
              <p>{loading}</p>
            ) : (
              <>
                <img
                  src={EmptyIllustrationDark}
                  alt="empty"
                  className="w-96 max-w-full"
                />
                <span className="text-xl font-bold">
                  Your Saved list is empty
                </span>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedPost;
