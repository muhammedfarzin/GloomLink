import PostFeed from "@/components/post/PostFeed";

const SavedPost = () => {
  return (
    <div className="m-auto max-w-[704px]">
      <div className="m-2">
        <PostFeed apiUrl="/posts/saved" emptyLabel="Your Saved list is empty" />
      </div>
    </div>
  );
};

export default SavedPost;
