import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import ProfileImage from "../../components/ProfileImage";
import Button from "../../components/Button";
import PostGridCard from "../../components/post/PostGridCard";

const Profile: React.FC = () => {
  const colorTheme = useSelector((state: RootState) => state.theme.colorTheme);

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
              <div id="profile-deta" className="flex flex-col justify-center w-1/3">
                <span className="text-lg font-bold">Username</span>
                <span className="text-sm font-light">Full Name</span>
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
            <div className="flex gap-2">
              <Button className="w-full">Edit Profile</Button>
              <Button className="w-full">Switch to Light</Button>
            </div>
            <div className="flex gap-2">
              <Button className="w-full">Enable Subscription</Button>
            </div>
          </div>
        </div>

        <div id="posts">
          <h3 className="text-xl font-bold my-2">Posts</h3>

          <div className="flex flex-wrap gap-2 p-2">
            <PostGridCard />
            <PostGridCard />
            <PostGridCard />
            <PostGridCard />
            <PostGridCard />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
