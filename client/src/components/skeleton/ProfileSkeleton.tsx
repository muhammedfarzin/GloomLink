import React from "react";

const ProfileSkeleton: React.FC = () => {
  return (
    <div className="m-2 animate-pulse">
      <div className="border border-border bg-foreground/10 rounded-lg md:rounded-2xl mt-8 p-4 md:p-8">
        {/* Top Header - Matches the Image and User Info structure */}
        <div className="flex gap-4 md:gap-8 max-h-16 items-center">
          {/* Profile Image field */}
          <div className="bg-background/50 min-w-12 w-12 h-12 md:min-w-16 md:w-16 md:h-16 rounded-full" />
          
          <div className="flex justify-between w-full">
            {/* User Data Visible Fields */}
            <div className="flex flex-col justify-center w-1/3 gap-2">
              <div className="h-5 md:h-6 bg-background/50 rounded w-24 md:w-32" />
              <div className="h-3 md:h-4 bg-background/50 rounded w-16 md:w-24" />
            </div>
            
            {/* Follow Counts Fields */}
            <div className="flex justify-around w-2/3">
              <div className="flex flex-col justify-center items-center gap-1.5">
                <div className="h-6 md:h-7 bg-background/50 rounded w-6 md:w-8" />
                <div className="h-3 md:h-4 bg-background/50 rounded w-14 md:w-16" />
              </div>
              <div className="flex flex-col justify-center items-center gap-1.5">
                <div className="h-6 md:h-7 bg-background/50 rounded w-6 md:w-8" />
                <div className="h-3 md:h-4 bg-background/50 rounded w-14 md:w-16" />
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons field */}
        <div className="flex flex-col gap-2 mt-4">
          <div className="flex gap-2">
            <div className="h-10 w-full bg-background/50 rounded-md" />
            <div className="h-10 w-full bg-background/50 rounded-md" />
          </div>
        </div>
      </div>

      {/* Posts Grid field */}
      <div className="mt-4">
        <div className="h-7 w-20 bg-foreground/10 rounded my-2" />
        <div className="flex flex-wrap gap-2 p-2">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="bg-foreground/10 w-full sm:w-[calc(50%-0.5rem)] md:w-[calc(33.333%-0.5rem)] aspect-square rounded-xl"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfileSkeleton;
