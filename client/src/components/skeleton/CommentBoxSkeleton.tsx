import React from "react";

export const CommentSkeleton: React.FC = () => (
  <div className="flex p-2 rounded-lg items-start bg-primary animate-pulse gap-2 mb-2">
    <div className="w-10 h-10 rounded-full bg-background/50 flex-shrink-0" />
    <div className="w-full flex flex-col gap-2">
      <div className="flex items-center gap-2 mt-1">
        <div className="h-4 w-24 bg-background/50 rounded" />
        <span className="text-xs text-gray-500 -mx-1">•</span>
        <div className="h-3 w-12 bg-background/50 rounded" />
      </div>
      <div className="h-4 w-full bg-background/50 rounded mt-1" />
      <div className="h-4 w-4/5 bg-background/50 rounded" />
      <div className="flex justify-end mt-1">
        <div className="h-6 w-12 bg-background/50 rounded" />
      </div>
    </div>
  </div>
);

const CommentBoxSkeleton: React.FC = () => {
  return (
    <div className="w-full h-full flex flex-col">
      <h3 className="text-lg font-bold my-2 mx-4">Comments</h3>
      <div className="px-4 overflow-y-hidden flex-1">
        <div className="flex flex-col w-full h-[calc(95vh-6.35rem)] md:h-[calc(82vh-6.35rem)] overflow-hidden">
          {Array.from({ length: 5 }).map((_, i) => (
            <CommentSkeleton key={i} />
          ))}
        </div>
      </div>

      {/* Input box skeleton */}
      <div className="flex items-center gap-2 w-full border-t bg-secondary border-[#6b728033] py-2 px-2 rounded-b-lg md:rounded-bl-none mt-auto animate-pulse">
        <div className="w-full h-10 bg-background/50 border border-foreground/10 rounded-lg" />
        <div className="w-10 h-10 bg-background/50 border border-foreground/10 rounded-lg flex-shrink-0" />
      </div>
    </div>
  );
};

export default CommentBoxSkeleton;
