import SearchBox from "@/components/SearchBox";
import UserListCard from "./components/UserListCard";
import React, { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import apiClient from "@/apiClient";
import { useToast } from "@/hooks/use-toast";
import { Post } from "@/components/post/types/Post";
import { UserDataType } from "@/components/types/user-data-types";
import PostSkeleton from "@/components/skeleton/PostSkeleton";

const PostListCard = React.lazy(() => import("@/components/post/PostListCard"));

export type SearchResultType =
  | (UserDataType & { type: "user" })
  | (Post & { type: "post" });

const Search: React.FC = () => {
  const { toast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>(
    searchParams.get("query") || ""
  );
  const [searchResult, setSearchResult] = useState<SearchResultType[]>([]);

  const handleApiError = (error?: any) => {
    toast({
      description:
        error.response.data.message || error.message || "Something went wrong",
      variant: "destructive",
    });
  };

  useEffect(() => {
    if (searchQuery) {
      setLoading("Fetching...");
      const params = Object.fromEntries(searchParams.entries());

      apiClient
        .get("/search", { params })
        .then((response) => setSearchResult(response.data))
        .catch((error) => handleApiError(error))
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
                  query: searchQuery,
                });
            }}
          />
        </div>

        {loading || !searchParams.get("query") || !searchResult.length ? (
          <div className="flex h-[80vh] justify-center items-center text-lg font-bold">
            {loading ||
              (!searchParams.get("query") &&
                "Search to list users and posts") ||
              "No result found"}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 mt-4">
            {searchResult.map((data) =>
              data.type === "user" ? (
                <UserListCard
                  key={data.type + data._id}
                  className="w-full"
                  userData={data}
                  handleChange={setSearchResult}
                />
              ) : (
                <Suspense fallback={<PostSkeleton />}>
                  <PostListCard
                    key={data.type + data._id}
                    postId={data._id}
                    postData={data}
                  />
                </Suspense>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
