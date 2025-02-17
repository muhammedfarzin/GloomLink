import { useEffect, useRef } from "react";

interface StreamVideoPlayerType {
  stream?: MediaStream;
  className?: string;
}

const StreamVideoPlayer: React.FC<StreamVideoPlayerType> = ({
  stream,
  className = "",
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && stream) videoRef.current.srcObject = stream;

    return () => {
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    };
  }, [stream]);

  return (
    <video
      ref={videoRef}
      className={`bg-secondary border border-border rounded-xl object-cover ${className}`}
      autoPlay
      muted
    />
  );
};

export default StreamVideoPlayer;
