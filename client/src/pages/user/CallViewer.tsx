import StreamVideoPlayer from "@/components/StreamVideoPlayer";
import { Button } from "@/components/ui/button";
import { useCall } from "@/hooks/use-call";
import { Phone } from "lucide-react";
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import ProfileImage from "@/components/ProfileImage";
import { useSocket } from "@/hooks/use-socket";
import { useToast } from "@/hooks/use-toast";

const CallViewer: React.FC = () => {
  const socket = useSocket();
  const { toast } = useToast();
  const callHandler = useCall();
  const [localStream, setLocalStream] = useState<MediaStream>();
  const [remoteStream, setRemoteStream] = useState<MediaStream>();

  useEffect(() => {
    if (!callHandler?.callData || !socket) return;

    if (!localStream) {
      navigator.mediaDevices
        .getUserMedia({ audio: true, video: true })
        .then((stream) => setLocalStream(stream));
    }

    const handleRemoteStream = async (e: RTCTrackEvent) => {
      const remoteStream = e.streams;
      setRemoteStream(remoteStream[0]);
    };

    const handleCallAccepted = async (
      username: string,
      answer: RTCSessionDescriptionInit,
      socketId: string
    ) => callHandler.callAccepted(answer, socketId, username);

    const handleEndCall = () => {
      toast({ description: `Call ended by ${callHandler.callData?.username}` });
      callHandler.endCall(false);
    };

    const handleCallError = (message: string) => {
      toast({ description: message, variant: "destructive" });
      callHandler.endCall(false);
    };

    callHandler.peer.addEventListener("track", handleRemoteStream);

    socket.on("call:accepted", handleCallAccepted);
    socket.on("call:end", handleEndCall);
    socket.on("call:error", handleCallError);

    return () => {
      callHandler.peer.removeEventListener("track", handleRemoteStream);

      socket.off("call:accepted", handleCallAccepted);
      socket.off("call:end", handleEndCall);
      socket.off("call:error", handleCallError);
    };
  }, [socket, localStream]);

  useEffect(() => {
    if (callHandler?.status === "connected") {
      navigator.mediaDevices
        .getUserMedia({
          audio: true,
          video: true,
        })
        .then((stream) => callHandler.sendStreams(stream));
    }

    return () => {
      localStream?.getTracks().forEach((track) => {
        track.stop();
        localStream.removeTrack(track);
      });
    };
  }, [callHandler?.status]);

  const handleEndCall = () => {
    callHandler?.endCall(true);
  };

  if (!callHandler?.callData) return <Navigate to="/" />;

  return (
    <div className="h-screen w-screen flex justify-center items-center relative">
      {callHandler.status !== "connected" ? (
        <div className="flex flex-col justify-around items-center w-full h-40">
          <div className="flex flex-col items-center gap-1 w-full">
            <ProfileImage />
            <span className="text-lg font-bold">
              {callHandler.callData.username}
            </span>
          </div>
          <span>Calling...</span>
        </div>
      ) : (
        <StreamVideoPlayer
          stream={remoteStream}
          className="max-h-[90vh] max-w-[90vw]"
          expand
        />
      )}

      <StreamVideoPlayer
        stream={localStream}
        className="absolute top-5 right-5 md:top-auto md:bottom-10 md:right-10 max-w-36 max-h-36 md:max-h-60 md:max-w-60"
        muted
      />

      {/* Controller */}
      <div className="absolute bottom-10 [&_svg]:size-6">
        <Button
          variant="destructive"
          className="rounded-full w-14 h-full hover:border border-border"
          onClick={handleEndCall}
        >
          <Phone className="rotate-[135deg]" />
        </Button>
      </div>
    </div>
  );
};

export default CallViewer;
