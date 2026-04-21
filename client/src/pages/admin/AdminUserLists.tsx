import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { adminApiClient } from "@/apiClient";
import { useToaster } from "@/hooks/useToaster";
import type { UserAuthState } from "../../redux/reducers/auth";
import ConfirmButton from "@/components/ConfirmButton";
import AdminUserListSkeleton from "@/components/skeleton/AdminUserListSkeleton";
import ManagementToolbar from "./components/ManagementToolbar";
import {
  ShieldBan,
  CheckCircle,
  Mail,
  Phone,
  User,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

type ExpandedUser = UserAuthState & { mobile?: string };

const statusMap = {
  active: {
    className:
      "bg-green-500/20 text-green-400 border-green-500/30 shadow-[0_0_10px_rgba(34,197,94,0.2)]",
    dotColor: "bg-green-400",
    text: "Active",
  },
  blocked: {
    className:
      "bg-red-500/20 text-red-400 border-red-500/30 shadow-[0_0_10px_rgba(239,68,68,0.2)]",
    dotColor: "bg-red-400",
    text: "Blocked",
  },
  "not-verified": {
    className:
      "bg-yellow-500/20 text-yellow-400 border-yellow-500/30 shadow-[0_0_10px_rgba(234,179,8,0.2)]",
    dotColor: "bg-yellow-400",
    text: "Unverified",
  },
};

const AdminUserLists: React.FC = () => {
  const { toastMessage, toastError } = useToaster();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState<string>(
    searchParams.get("q") || "",
  );
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<ExpandedUser[]>([]);

  // Pagination State
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "10", 10);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    setLoading(true);
    const query = Object.fromEntries(searchParams.entries());
    adminApiClient
      .get("/users", { params: { ...query, limit } }) // Always enforce limit for pagination
      .then((response) => {
        const fetchedUsers = response.data.usersData;
        setUsers(fetchedUsers);
        setHasMore(fetchedUsers.length === limit);
      })
      .catch((error) => {
        toastError(error.message || "Failed to load users");
      })
      .finally(() => setLoading(false));
  }, [searchParams]);

  const blockUser = async (userId: string) => {
    try {
      const response = await adminApiClient.patch(`/users/${userId}/status`);
      toastMessage(response.data.message);
      setUsers(
        users.map((user) => {
          if (user.userId === userId) {
            user.status = user.status === "active" ? "blocked" : "active";
          }
          return user;
        }),
      );
    } catch (error: any) {
      toastError(error.message);
    }
  };

  const handleFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams);
    if (e.target.value === "all") params.delete("filter");
    else params.set("filter", e.target.value);
    params.set("page", "1");
    setSearchParams(params);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    if (searchQuery) params.set("q", searchQuery);
    else params.delete("q");
    params.set("page", "1");
    setSearchParams(params);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage < 1) return;
    const params = new URLSearchParams(searchParams);
    params.set("page", newPage.toString());
    setSearchParams(params);
    document
      .getElementById("app-container")
      ?.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="px-6 pt-6 max-w-7xl w-full mx-auto">
      <ManagementToolbar
        title="User Management"
        description="View, filter, and manage platform users"
        searchQuery={searchQuery}
        searchPlaceholder="Search users..."
        filter={searchParams.get("filter") || "all"}
        filters={{
          all: "All Users",
          active: "Active",
          blocked: "Blocked",
        }}
        onSearchQueryChange={setSearchQuery}
        onSearch={handleSearch}
        onFilterChange={handleFilter}
      />

      {loading ? (
        <AdminUserListSkeleton />
      ) : users.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 bg-primary/20 border border-primary/10 rounded-xl mt-4">
          <User size={48} className="text-gray-600 mb-4" />
          <h3 className="text-xl font-semibold text-gray-300">
            No users found
          </h3>
          <p className="text-gray-500 mt-2 text-center max-w-md">
            We couldn't find any users matching your current filters or search
            query.
          </p>
        </div>
      ) : (
        <div className="space-y-4 animate-in fade-in duration-700 slide-in-from-bottom-4">
          {users.map((user) => (
            <div
              key={user.userId}
              className="group bg-primary/30 hover:bg-primary/40 border border-primary/10 hover:border-primary/30 p-5 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between shadow-md transition-all duration-300"
            >
              {/* User Info */}
              <div className="flex flex-1 items-center gap-4 w-full sm:w-auto">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-neon-cyan/80 to-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-[0_0_15px_rgba(0,255,255,0.3)] shrink-0 group-hover:scale-105 transition-transform">
                  {user.firstname[0]?.toUpperCase()}
                  {user.lastname ? user.lastname[0]?.toUpperCase() : ""}
                </div>
                <div>
                  <h3 className="text-white font-semibold text-lg group-hover:text-neon-cyan transition-colors truncate max-w-[200px] lg:max-w-xs">
                    {user.firstname} {user.lastname}
                  </h3>
                  <p className="text-gray-400 text-sm">@{user.username}</p>
                </div>
              </div>

              {/* Contact Details */}
              <div className="flex flex-1 flex-col sm:items-end md:items-start gap-1 mt-4 sm:mt-0 px-2 lg:px-8 shrink-0">
                <div className="flex items-center gap-2 text-gray-300 text-sm">
                  <Mail size={14} className="text-neon-cyan/70 shrink-0" />
                  <span className="truncate max-w-[200px]">{user.email}</span>
                </div>
                {user.mobile && (
                  <div className="flex items-center gap-2 text-gray-300 text-sm">
                    <Phone size={14} className="text-neon-cyan/70 shrink-0" />
                    <span>{user.mobile}</span>
                  </div>
                )}
              </div>

              {/* Status and Actions */}
              <div className="flex flex-col-reverse sm:flex-row items-start sm:items-center justify-between sm:justify-end w-full sm:w-auto mt-4 sm:mt-0 gap-4 sm:gap-6 shrink-0">
                {/* <StatusBadge status={user.status} /> */}
                <span
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${statusMap[user.status]?.className ?? "bg-gray-500/20 text-gray-400 border border-gray-500/30"}`}
                >
                  <div
                    className={`w-2 h-2 rounded-full ${statusMap[user.status]?.dotColor ?? "bg-gray-400"}`}
                  />
                  {statusMap[user.status]?.text ?? user.status}
                </span>

                <ConfirmButton
                  className="w-full sm:w-auto shrink-0"
                  description={`Are you sure you want to ${user.status === "active" ? "block" : "activate"} @${user.username}?`}
                  confirmButtonText={
                    user.status === "active" ? "Block" : "Activate"
                  }
                  onSuccess={() => blockUser(user.userId)}
                >
                  <button
                    title={
                      user.status === "active" ? "Block User" : "Activate User"
                    }
                    className={`p-2.5 rounded-lg transition-all flex items-center justify-center border w-full sm:w-auto group/btn ${
                      user.status === "active"
                        ? "bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20 hover:border-red-500/40 hover:shadow-[0_0_15px_rgba(239,68,68,0.3)]"
                        : "bg-green-500/10 text-green-400 border-green-500/20 hover:bg-green-500/20 hover:border-green-500/40 hover:shadow-[0_0_15px_rgba(34,197,94,0.3)]"
                    }`}
                  >
                    {user.status === "active" ? (
                      <ShieldBan
                        size={18}
                        className="group-hover/btn:scale-110 transition-transform"
                      />
                    ) : (
                      <CheckCircle
                        size={18}
                        className="group-hover/btn:scale-110 transition-transform"
                      />
                    )}
                  </button>
                </ConfirmButton>
              </div>
            </div>
          ))}

          {/* Pagination */}
          <div className="flex items-center justify-between pt-6 border-t border-primary/10 mt-6 md:px-2">
            <p className="text-sm text-gray-400">
              Showing page{" "}
              <span className="text-white font-medium">{page}</span>
            </p>
            <div className="flex gap-2">
              <button
                disabled={page === 1}
                onClick={() => handlePageChange(page - 1)}
                className="p-2 bg-primary/40 border border-primary/20 rounded-md text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/60 transition-colors focus:ring-1 focus:ring-neon-cyan focus:outline-none"
                aria-label="Previous Page"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                disabled={!hasMore}
                onClick={() => handlePageChange(page + 1)}
                className="p-2 bg-primary/40 border border-primary/20 rounded-md text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/60 transition-colors focus:ring-1 focus:ring-neon-cyan focus:outline-none"
                aria-label="Next Page"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUserLists;
