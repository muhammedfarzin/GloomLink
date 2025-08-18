import adminApiClient from "@/adminApiClient";
import DropDownBox from "@/components/DropDownBox";
import { Post } from "@/components/post/types/Post";
import SearchBox from "@/components/SearchBox";
import PostSkeleton from "@/components/skeleton/PostSkeleton";
import { useToast } from "@/hooks/use-toast";
import React, { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

const PostListCard = React.lazy(() => import("@/components/post/PostListCard"));

const AdminPostLists: React.FC = () => {
  const { toast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [loading, setLoading] = useState<string | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    setLoading("Loading...");
    const query = Object.fromEntries(searchParams.entries());
    adminApiClient
      .get("/posts", { params: query })
      .then((response) => {
        setPosts(response.data.posts as Post[]);
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
  }, [searchParams]);

  const handleFilter: React.ChangeEventHandler<HTMLSelectElement> = (e) => {
    setSearchParams({
      ...Object.fromEntries(searchParams.entries()),
      filter: e.target.value,
    });
  };

  const handleSearch = () => {
    setSearchParams({
      ...Object.fromEntries(searchParams.entries()),
      query: searchQuery,
    });
  };

  return (
    <div className="m-auto w-full max-w-[1000px]">
      <div className="m-2">
        <div className="flex items-center gap-2 actions mt-5">
          <SearchBox
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onSubmit={handleSearch}
          />

          <DropDownBox
            className="max-w-28"
            onChange={handleFilter}
            placeholder="All"
            value={searchParams.get("filter") || undefined}
          >
            <option value="active">Active</option>
            <option value="blocked">Blocked</option>
            <option value="reported">Reported</option>
          </DropDownBox>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-[85vh]">
            <span>{loading}</span>
          </div>
        ) : (
          <div className="flex flex-wrap mt-3" id="posts-list">
            {posts.length ? (
              posts.map((post) => (
                <div className="w-full md:w-1/2 p-1">
                  <Suspense fallback={<PostSkeleton />}>
                    <PostListCard
                      postId={post._id}
                      isAdmin
                      postData={post}
                      handleChange={setPosts}
                    />
                  </Suspense>
                </div>
              ))
            ) : (
              <span className="text-center w-full">
                There is no posts available
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPostLists;
