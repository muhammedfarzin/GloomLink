import { useEffect, useState } from "react";
import PostListCard, { type Post } from "../../components/post/PostListCard";
import apiClient from "@/apiClient";

const Home = () => {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    apiClient.get("/posts").then((response) => {
      setPosts(response.data as Post[]);
    });
  }, []);

  return (
    <div className="m-auto max-w-[704px]">
      <div className="m-2">
        <div className="flex flex-col items-center gap-2 mt-5">
          {posts.map((post) => (
            <PostListCard key={post._id} postData={post} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
