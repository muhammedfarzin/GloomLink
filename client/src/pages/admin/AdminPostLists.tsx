import React, { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { adminApiClient } from "@/apiClient";
import { useToast } from "@/hooks/use-toast";
import { Post } from "@/components/post/types/Post";
import PostSkeleton from "@/components/skeleton/PostSkeleton";
import { Image as ImageIcon, ChevronLeft, ChevronRight } from "lucide-react";
import ManagementToolbar from "./components/ManagementToolbar";

const PostListCard = React.lazy(() => import("@/components/post/PostListCard"));

const AdminPostLists: React.FC = () => {
  const { toast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState<string>(
    searchParams.get("q") || "",
  );
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState<Post[]>([]);

  // Pagination State
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "12", 10);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    setLoading(true);
    const query = Object.fromEntries(searchParams.entries());
    adminApiClient
      .get("/posts", { params: { ...query, limit } })
      .then((response) => {
        const fetchedPosts = response.data.postsData as Post[];
        setPosts(fetchedPosts);
        setHasMore(fetchedPosts.length === limit);
      })
      .catch((error) => {
        toast({
          description: error.message || "Something went wrong",
          variant: "destructive",
        });
      })
      .finally(() => setLoading(false));
  }, [searchParams]);

  const handleFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams);
    if (e.target.value === "all") params.delete("filter");
    else params.set("filter", e.target.value);
    params.set("page", "1");
    setSearchParams(params);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    if (searchQuery) params.set("q", searchQuery);
    else params.delete("q");
    params.set("page", "1");
    setSearchParams(params);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage < 1) return;
    const params = new URLSearchParams(searchParams);
    params.set("page", newPage.toString());
    setSearchParams(params);
    document
      .getElementById("app-container")
      ?.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="p-6 max-w-7xl w-full mx-auto">
      <ManagementToolbar
        title="Content Management"
        description="Review, monitor, and moderate user posts"
        searchQuery={searchQuery}
        searchPlaceholder="Search posts..."
        filter={searchParams.get("filter") || "all"}
        filters={{
          all: "All Posts",
          active: "Active",
          blocked: "Blocked",
          reported: "Reported",
        }}
        onSearchQueryChange={setSearchQuery}
        onSearch={handleSearch}
        onFilterChange={handleFilter}
      />

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="w-full">
              <PostSkeleton />
            </div>
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 bg-primary/20 border border-primary/10 rounded-xl mt-4">
          <ImageIcon size={48} className="text-gray-600 mb-4" />
          <h3 className="text-xl font-semibold text-gray-300">
            No posts found
          </h3>
          <p className="text-gray-500 mt-2 text-center max-w-md">
            There are no posts matching your current filters or search query.
          </p>
        </div>
      ) : (
        <div className="space-y-6 animate-in fade-in duration-700 slide-in-from-bottom-4">
          <div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start"
            id="posts-list"
          >
            {posts.map((post) => (
              <div key={post.postId} className="w-full min-w-[300px]">
                <Suspense fallback={<PostSkeleton />}>
                  <PostListCard
                    postId={post.postId}
                    postData={post}
                    isAdmin
                    noRecordInteraction
                    handleChange={setPosts as any}
                  />
                </Suspense>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between pt-6 border-t border-primary/10 mt-6 md:px-2">
            <p className="text-sm text-gray-400">
              Showing page{" "}
              <span className="text-white font-medium">{page}</span>
            </p>
            <div className="flex gap-2">
              <button
                disabled={page === 1}
                onClick={() => handlePageChange(page - 1)}
                className="p-2 bg-primary/40 border border-primary/20 rounded-md text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/60 transition-colors focus:ring-1 focus:ring-neon-cyan focus:outline-none"
                aria-label="Previous Page"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                disabled={!hasMore}
                onClick={() => handlePageChange(page + 1)}
                className="p-2 bg-primary/40 border border-primary/20 rounded-md text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/60 transition-colors focus:ring-1 focus:ring-neon-cyan focus:outline-none"
                aria-label="Next Page"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPostLists;
