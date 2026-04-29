import { Route, Routes, useLocation } from "react-router-dom";
import UserLayout from "@/layouts/UserLayout";
import Home from "@/pages/user/Home";
import Search from "@/pages/user/Search";
import Messages from "@/pages/user/Messages";
import Profile from "@/pages/user/Profile";
import EditProfile from "@/pages/user/EditProfile";
import CreatePost from "@/pages/user/CreatePost";
import SavedPost from "@/pages/user/SavedPost";
import MessageViewer from "@/pages/user/MessageViewer";
import PostViewPage from "@/pages/user/PostViewPage";
import CallViewer from "@/pages/user/CallViewer";

const UserRoutes = () => {
  const location = useLocation();

  return (
    <>
      <Routes location={location.state?.backgroundLocation || location}>
        <Route element={<UserLayout />}>
          <Route index element={<Home />} />
          <Route path="search" element={<Search />} />
          <Route path="messages" element={<Messages />} />
          <Route path=":username" element={<Profile />} />
          <Route path="profile" element={<Profile self />} />
          <Route path="profile/edit" element={<EditProfile />} />
          <Route path="create-post" element={<CreatePost />} />
          <Route path="saved-post" element={<SavedPost />} />
          <Route path="messages/:username" element={<MessageViewer />} />
          <Route path="post/:postId" element={<PostViewPage />} />
          <Route path="post/:postId/edit" element={<CreatePost />} />
        </Route>
        <Route path="call" element={<CallViewer />} />
      </Routes>

      {location.state?.backgroundLocation && (
        <Routes>
          <Route path="post/:postId" element={<PostViewPage />} />
        </Routes>
      )}
    </>
  );
};

export default UserRoutes;
