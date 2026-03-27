import React from "react";

const AdminUserListSkeleton: React.FC = () => {
  return (
    <div className="w-full space-y-4 animate-pulse overflow-hidden">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="bg-primary/20 border border-primary/10 p-4 rounded-xl flex items-center justify-between"
        >
          <div className="flex items-center gap-4 w-1/3">
            <div className="w-10 h-10 rounded-full bg-primary/40 shrink-0"></div>
            <div className="space-y-2 w-full">
              <div className="h-4 bg-primary/40 rounded w-3/4"></div>
              <div className="h-3 bg-primary/40 rounded w-1/2"></div>
            </div>
          </div>
          <div className="w-1/4 hidden md:block">
            <div className="h-4 bg-primary/40 rounded w-full"></div>
          </div>
          <div className="w-20 hidden sm:block">
            <div className="h-6 bg-primary/40 rounded-full w-full"></div>
          </div>
          <div className="w-24 shrink-0 flex justify-end">
            <div className="h-8 bg-primary/40 rounded-md w-full"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdminUserListSkeleton;
