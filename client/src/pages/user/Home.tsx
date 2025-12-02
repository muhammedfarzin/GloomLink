import PostFeed from "@/components/post/PostFeed";

const Home = () => {
  return (
    <div className="m-auto max-w-[704px]">
      <div className="m-2">
        <PostFeed
          apiUrl="/posts"
          emptyLabel="No recommendations yet. Interact with more posts!"
        />
      </div>
    </div>
  );
};

export default Home;
