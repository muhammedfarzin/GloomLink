import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { apiClient } from "@/apiClient";
import UserOverviewCard from "@/features/profile/UserOverviewCard";
import PostGridCard from "@/features/post/PostGridCard";
import ProfileSkeleton from "@/components/skeleton/ProfileSkeleton";
import type { UserProfile } from "@/types/user";
import type { RootState } from "@/redux/store";

interface ProfileProps {
  self?: boolean;
}

interface PostsType {
  postId: string;
  userId: string;
  caption: string;
  images: string[];
  tags: string[];
  publishedFor: string;
  status: string;
}

const Profile: React.FC<ProfileProps> = ({ self = false }) => {
  const myUsername = useSelector(
    (state: RootState) => state.auth.userData?.username,
  );
  const { username } = useParams();
  const [userData, setUserData] = useState<UserProfile>();
  const [posts, setPosts] = useState<PostsType[]>([]);
  const [isFollowing, setIsFollowing] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    apiClient
      .get(`/profile/${username || myUsername}`)
      .then((response) => {
        const { posts, isFollowing, ...userData } = response.data.userData;
        setIsFollowing(isFollowing);
        setUserData(userData);
        setPosts(posts);
      })
      .catch((error) => {
        setError(error.message);
      })
      .finally(() => setLoading(false));
  }, [username]);

  return (
    <div className="m-auto max-w-[704px]">
      {loading ? (
        <ProfileSkeleton />
      ) : !userData ? (
        <div className="w-full h-[100vh] flex flex-col justify-center items-center text-center gap-4">
          <h2 className="text-2xl md:text-xl font-bold text-foreground">
            {error || "Something went wrong"}
          </h2>
        </div>
      ) : (
        <div className="m-2">
          <UserOverviewCard
            userData={userData}
            self={self}
            isFollowing={isFollowing}
            onClickFollow={setIsFollowing}
          />

          <div id="posts">
            <h3 className="text-xl font-bold my-2">Posts</h3>

            {posts?.length ? (
              <div className="flex flex-wrap gap-2 p-2">
                {posts?.map((post) => (
                  <PostGridCard
                    key={post.postId}
                    postId={post.postId}
                    image={post.images[0]}
                    caption={post.caption}
                  />
                ))}
              </div>
            ) : (
              <div className="w-full text-center">No post uploaded yet</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
