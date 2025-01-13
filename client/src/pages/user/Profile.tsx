import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import ProfileImage from "../../components/ProfileImage";
import Button from "../../components/Button";
import PostGridCard from "../../components/post/PostGridCard";
import { useEffect, useState } from "react";
import apiClient from "@/apiClient";

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

const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL as string;

const Profile: React.FC<ProfileProps> = ({ self = false }) => {
  const colorTheme = useSelector((state: RootState) => state.theme.colorTheme);
  const [userData, setUserData] = useState<UserDataType>();
  const [posts, setPosts] = useState<PostsType[]>();

  useEffect(() => {
    if (self) {
      apiClient.get("/profile").then((response) => {
        const { posts, ...userData } = response.data;
        setUserData(userData);
        setPosts(posts);
      });
    }
  }, []);

  return (
    <div className="m-auto max-w-[704px]">
      <div className="m-2">
        <div
          className="border rounded-lg md:rounded-2xl mt-8 p-4 md:p-8"
          style={{
            backgroundColor: colorTheme.secondary,
            borderColor: colorTheme.border,
          }}
        >
          <div className="flex gap-4 md:gap-8 max-h-16">
            <ProfileImage />
            <div className="flex justify-between w-full">
              <div
                id="profile-deta"
                className="flex flex-col justify-center w-1/3"
              >
                <span className="text-lg font-bold">{userData?.username}</span>
                <span className="text-sm font-light">{userData?.fullname}</span>
              </div>
              <div className="flex justify-around w-2/3">
                <div className="flex flex-col justify-center text-center">
                  <span className="text-xl font-bold">1.6K</span>
                  <span className="text-sm font-light">Followers</span>
                </div>
                <div className="flex flex-col justify-center text-center">
                  <span className="text-xl font-bold">1.1K</span>
                  <span className="text-sm font-light">Following</span>
                </div>
              </div>
            </div>
          </div>

          <div id="profile-actions" className="flex flex-col gap-2 mt-4">
            {self ? (
              <>
                <div className="flex gap-2">
                  <Button className="w-full">Edit Profile</Button>
                  <Button className="w-full">Switch to Light</Button>
                </div>
                <div className="flex gap-2">
                  <Button className="w-full">Enable Subscription</Button>
                </div>
              </>
            ) : (
              <>
                <div className="flex gap-2">
                  <Button className="w-full">Follow</Button>
                  <Button className="w-full">Message</Button>
                  <Button className="w-full">Subscribe</Button>
                </div>
              </>
            )}
          </div>
        </div>

        <div id="posts">
          <h3 className="text-xl font-bold my-2">Posts</h3>

          <div className="flex flex-wrap gap-2 p-2">
            {posts?.map((post) => (
              <PostGridCard
                key={post._id}
                image={IMAGE_BASE_URL + post.images[0]}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
