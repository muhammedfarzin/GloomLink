import { Route, Routes } from "react-router-dom";
import AdminLayout from "@/layouts/AdminLayout";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminUserLists from "@/pages/admin/AdminUserLists";
import AdminPostLists from "@/pages/admin/AdminPostLists";

const AdminRoutes = () => {
  return (
    <Routes>
      <Route element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="users" element={<AdminUserLists />} />
        <Route path="posts" element={<AdminPostLists />} />
      </Route>
    </Routes>
  );
};

export default AdminRoutes;
