import React, { Suspense, useEffect, useState } from "react";
import SearchBox from "@/components/SearchBox";
import UserListCard from "./components/UserListCard";
import { useSearchParams } from "react-router-dom";
import { apiClient } from "@/apiClient";
import { useToaster } from "@/hooks/useToaster";
import PostSkeleton from "@/components/skeleton/PostSkeleton";
import type { Post } from "@/features/types/Post";
import type { UserDataType } from "@/components/types/user-data-types";

const PostListCard = React.lazy(() => import("@/features/post/PostListCard"));

export type SearchResultType =
  | (UserDataType & { type: "user" })
  | (Post & { type: "post" });

const Search: React.FC = () => {
  const { toastError } = useToaster();
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>(
    searchParams.get("q") || "",
  );
  const [searchResult, setSearchResult] = useState<SearchResultType[]>([]);

  useEffect(() => {
    if (searchQuery) {
      setLoading("Fetching...");
      const params = Object.fromEntries(searchParams.entries());

      apiClient
        .get("/search", { params })
        .then((response) => setSearchResult(response.data.resultsData))
        .catch((error) => toastError(error.message))
        .finally(() => setLoading(null));
    }
  }, [searchParams]);

  return (
    <div className="m-auto max-w-[704px]">
      <div className="m-2 mt-0">
        <div className="sticky top-0 pt-2 rounded-b-lg z-30 bg-background">
          <SearchBox
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onSubmit={() => {
              if (searchQuery)
                setSearchParams({
                  ...Object.fromEntries(searchParams.entries()),
                  q: searchQuery,
                });
            }}
          />
        </div>

        {loading || !searchParams.get("q") || !searchResult.length ? (
          <div className="flex h-[80vh] justify-center items-center text-lg font-bold">
            {loading ||
              (!searchParams.get("q") && "Search to list users and posts") ||
              "No result found"}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 mt-4">
            {searchResult.map((data) =>
              data.type === "user" ? (
                <UserListCard
                  key={data.type + data.userId}
                  className="w-full"
                  userData={data}
                  handleChange={setSearchResult}
                />
              ) : (
                <Suspense
                  key={data.type + data.postId}
                  fallback={<PostSkeleton />}
                >
                  <PostListCard postId={data.postId} postData={data} />
                </Suspense>
              ),
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
