import PostListCard from "../../components/post/PostListCard";

const SavedPost = () => {
  return (
    <div className="m-auto max-w-[704px]">
      <div className="m-2">
        <div className="flex flex-col items-center gap-2 mt-5">
          <PostListCard />
          <PostListCard />
          <PostListCard />
          <PostListCard />
        </div>
      </div>
    </div>
  );
}

export default SavedPost;