import { useEffect, useState } from "react";
import PostListCard, { type Post } from "../../components/post/PostListCard";
import apiClient from "@/apiClient";
import { useToast } from "@/hooks/use-toast";

const Home = () => {
  const { toast } = useToast();
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    apiClient
      .get("/posts")
      .then((response) => {
        setPosts(response.data as Post[]);
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
  }, []);

  return (
    <div className="m-auto max-w-[704px]">
      <div className="m-2">
        <div className="flex flex-col items-center gap-2 mt-5">
          {posts.map((post) => (
            <PostListCard key={post._id} postData={post} handleChange={setPosts} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
