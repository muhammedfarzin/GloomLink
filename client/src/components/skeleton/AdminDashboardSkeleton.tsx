import ChartSkeleton from "./ChartSkeleton";
import StatCardSkeleton from "./StatCardSkeleton";

const AdminDashboardSkeleton = () => {
  return (
    <div className="space-y-8 animate-pulse w-full mt-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {[...Array(5)].map((_, i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>

      <ChartSkeleton />
    </div>
  );
};

export default AdminDashboardSkeleton;
