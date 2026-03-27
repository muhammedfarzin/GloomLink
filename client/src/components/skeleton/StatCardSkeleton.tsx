const StatCardSkeleton = () => {
  return (
    <div className="bg-primary/40 border border-primary/20 p-6 rounded-xl flex items-center justify-between shadow-lg h-[104px]">
      <div className="space-y-3 w-full">
        <div className="h-3 bg-primary/60 rounded w-1/2"></div>
        <div className="h-8 bg-primary/60 rounded w-3/4"></div>
      </div>
      <div className="h-14 w-14 rounded-full bg-primary/60 ml-4 shrink-0"></div>
    </div>
  );
};

export default StatCardSkeleton;
