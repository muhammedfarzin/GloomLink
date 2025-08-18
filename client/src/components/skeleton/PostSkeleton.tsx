interface Props {
  className?: string;
}

const PostSkeleton: React.FC<Props> = ({ className }) => {
  return (
    <div
      className={[
        "bg-foreground/10 rounded-2xl w-full max-w-lg p-4 flex flex-col gap-3 animate-pulse",
        className,
      ].join(" ")}
    >
      <div className="flex flex-row items-center gap-2">
        <div className="rounded-full w-10 bg-background/50 aspect-square" />
        <div className="rounded-full w-40 h-5 bg-background/50" />
      </div>
      <div className="bg-background/50 w-full aspect-video rounded-xl" />
      <div className="flex flex-row justify-between">
        <div className="bg-background/50 w-1/2 h-12 rounded-xl" />
        <div className="bg-background/50 w-12 aspect-square rounded-xl" />
      </div>
    </div>
  );
};

export default PostSkeleton;
