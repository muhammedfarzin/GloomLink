const ChartSkeleton = () => {
  return (
    <div className="bg-primary/30 border border-primary/10 rounded-xl p-6 shadow-xl h-[480px] w-full flex flex-col">
      <div className="h-6 bg-primary/50 rounded w-1/4 mb-8"></div>
      <div className="flex-1 w-full flex items-end justify-between gap-4 pb-4 px-2">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="flex-1 bg-primary/40 rounded-t-sm"
            style={{ height: `${Math.random() * 60 + 20}%` }}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default ChartSkeleton;
