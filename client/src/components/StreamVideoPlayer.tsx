import { useEffect, useRef } from "react";

interface StreamVideoPlayerType {
  stream?: MediaStream;
  className?: string;
  expand?: boolean;
  muted?: boolean;
}

const StreamVideoPlayer: React.FC<StreamVideoPlayerType> = ({
  stream,
  className = "",
  expand = false,
  muted = false,
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

  useEffect(() => {
    const updateAspectRatio = () => {
      if (videoRef.current && expand) {
        const videoWidth = videoRef.current.videoWidth;
        const videoHeight = videoRef.current.videoHeight;
        const screenWidth = window.screen.width;
        const screenHeight = window.screen.height;

        const setAspectRatio = (isPortrait: boolean = false) => {
          if (!videoRef.current) return;
          if (screenWidth < screenHeight) {
            videoRef.current.style.width = `${screenWidth * 0.9}px`;
            videoRef.current.style.height = "";
          } else {
            videoRef.current.style.height = `${screenHeight * 0.9}px`;
            videoRef.current.style.width = "";
          }
          videoRef.current.style.aspectRatio = isPortrait ? "9/16" : "16/9";
        };

        if (videoWidth < videoHeight) setAspectRatio(true);
        else setAspectRatio(false);
      }
    };

    updateAspectRatio();
    window.addEventListener("resize", updateAspectRatio);

    return () => {
      window.removeEventListener("resize", updateAspectRatio);
    };
  }, []);

  return (
    <video
      ref={videoRef}
      className={`bg-secondary border border-border rounded-xl object-cover ${className}`}
      autoPlay
      muted={muted}
    />
  );
};

export default StreamVideoPlayer;
