import { lazy, Suspense } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import LoadingWidget from "@/components/LoadingWidget";

const UserRoutes = lazy(() => import("./UserRoutes"));
const AdminRoutes = lazy(() => import("./AdminRoutes"));
const AuthRoutes = lazy(() => import("./AuthRoutes"));

export const AppRoutes = () => {
  const location = useLocation();

  return (
    <Suspense
      key={location.pathname.split("/")[1] === "auth" ? 0 : 1}
      fallback={<LoadingWidget fullScreen />}
    >
      <Routes>
        <Route path="/auth/*" element={<AuthRoutes />} />
        <Route path="/admin/*" element={<AdminRoutes />} />
        <Route path="/*" element={<UserRoutes />} />
      </Routes>
    </Suspense>
  );
};
