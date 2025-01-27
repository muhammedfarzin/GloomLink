import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import ProfileImage from "../../components/ProfileImage";
import PostGridCard from "../../components/post/PostGridCard";
import { useEffect, useState } from "react";
import apiClient from "@/apiClient";
import { useParams } from "react-router-dom";
import { AxiosError } from "axios";
import { useToast } from "@/hooks/use-toast";
import FollowDialogButton from "./components/FollowDialogButton";
import ProfileActions from "./components/ProfileActions";

interface ProfileProps {
  self?: boolean;
}

interface UserDataType {
  _id: string;
  username: string;
  firstname: string;
  lastname: string;
  image?: string;
  fullname: string;
  followersCount: number;
  followingCount: number;
}

interface PostsType {
  _id: string;
  userId: string;
  caption: string;
  images: string[];
  tags: string[];
  publishedFor: string;
  status: string;
}

const Profile: React.FC<ProfileProps> = ({ self = false }) => {
  const { toast } = useToast();
  const colorTheme = useSelector((state: RootState) => state.theme.colorTheme);
  const { username } = useParams();
  const [userData, setUserData] = useState<UserDataType>();
  const [posts, setPosts] = useState<PostsType[]>([]);
  const [isFollowing, setIsFollowing] = useState<boolean>(false);
  const [loading, setLoading] = useState<string | null>();

  useEffect(() => {
    setLoading("Loading...");
    apiClient
      .get(`/profile/${username || ""}`)
      .then((response) => {
        const { posts, isFollowing, ...userData } = response.data;
        setIsFollowing(isFollowing);
        setUserData(userData);
        setPosts(posts);
        setLoading(null);
      })
      .catch((error) => {
        if (error instanceof AxiosError) {
          setLoading(error.response?.data.message || error.message);
        } else setLoading("Something went wrong");
      });
  }, [username]);

  const handleFollow = async (type: "follow" | "unfollow") => {
    try {
      setIsFollowing(!isFollowing);
      await apiClient.post(`/profile/${type}/${userData?._id}`);
    } catch (error: any) {
      setIsFollowing(isFollowing);
      toast({
        description:
          error.response?.data?.message ||
          error.message ||
          "Something went wrong",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="m-auto max-w-[704px]">
      {loading || !userData ? (
        <div className="w-full h-screen flex justify-center items-center">
          {loading}
        </div>
      ) : (
        <div className="m-2">
          <div
            className="border rounded-lg md:rounded-2xl mt-8 p-4 md:p-8"
            style={{
              backgroundColor: colorTheme.secondary,
              borderColor: colorTheme.border,
            }}
          >
            <div className="flex gap-4 md:gap-8 max-h-16 items-center">
              <ProfileImage
                profileImage={userData.image}
                className="min-w-12"
              />
              <div className="flex justify-between w-full">
                <div
                  id="profile-deta"
                  className="flex flex-col justify-center w-1/3"
                >
                  <span className="text-lg font-bold truncate">
                    {userData?.username}
                  </span>
                  <span className="text-sm font-light truncate">
                    {userData?.fullname}
                  </span>
                </div>
                <div className="flex justify-around w-2/3">
                  <FollowDialogButton
                    userId={userData._id}
                    followCount={userData?.followersCount}
                    type="followers"
                  />
                  <FollowDialogButton
                    userId={userData._id}
                    followCount={userData?.followingCount}
                    type="following"
                  />
                </div>
              </div>
            </div>

            <ProfileActions
              username={username}
              self={self}
              followersCount={userData.followersCount}
              isFollowing={isFollowing}
              handleFollow={handleFollow}
            />
          </div>

          <div id="posts">
            <h3 className="text-xl font-bold my-2">Posts</h3>

            {posts?.length ? (
              <div className="flex flex-wrap gap-2 p-2">
                {posts?.map((post) => (
                  <PostGridCard
                    key={post._id}
                    postId={post._id}
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
