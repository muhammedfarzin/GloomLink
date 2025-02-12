import { useSocket } from "@/hooks/use-socket";
import { useToast } from "@/hooks/use-toast";
import { peer } from "@/services/peer";
import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export interface IncomeCallType {
  username: string;
  offer?: RTCSessionDescriptionInit;
  socketId?: string;
}

interface CallContextType {
  callData: IncomeCallType | null;
  status: "calling" | "connected" | null;
  peer: RTCPeerConnection;
  callUser: (username: string) => Promise<void>;
  acceptCall: (callData: Required<IncomeCallType>) => Promise<void>;
  callAccepted: (
    answer: RTCSessionDescriptionInit,
    socketId: string,
    username: string
  ) => void;
  sendStreams: (stream: MediaStream) => void;
  endCall: (isMe: boolean) => void;
}

interface CallProviderType {
  children?: React.ReactNode;
}

export const CallContext = createContext<CallContextType | null>(null);
const callPathnameRegex = /^\/call\/?$/;

const CallProvider: React.FC<CallProviderType> = ({ children }) => {
  const navigate = useNavigate();
  const socket = useSocket();
  const { toast } = useToast();
  const [callData, setCallData] = useState<IncomeCallType | null>(null);
  const [status, setStatus] = useState<CallContextType["status"]>(null);
  const pathname = location.pathname;

  const clearState = () => {
    peer.resetConnection();
    setCallData(null);
    setStatus(null);
    navigate(-1);
  };

  useEffect(() => {
    if (callData && !callPathnameRegex.test(pathname)) navigate("/call");
  }, [pathname, callData]);

  useEffect(() => {
    const handleNegotiationNeeded = async () => {
      const offer = await peer.getOffer();
      socket?.emit("call:negotiationneeded", offer, callData?.socketId);
    };

    const handleIceCandidate = (e: RTCPeerConnectionIceEvent) => {
      if (e.candidate) {
        socket?.emit("call:ice-candidate", e.candidate, callData?.socketId);
      }
    };

    peer.peer.addEventListener("negotiationneeded", handleNegotiationNeeded);

    peer.peer.addEventListener("icecandidate", handleIceCandidate);
    return () => {
      peer.peer.removeEventListener(
        "negotiationneeded",
        handleNegotiationNeeded
      );
      peer.peer.removeEventListener("icecandidate", handleIceCandidate);
    };
  }, [peer, socket, callData]);

  useEffect(() => {
    const handleIncomeCallNegotiationNeeded = async (
      _username: string,
      offer: RTCSessionDescription,
      socketId: string
    ) => {
      const answer = await peer.getAnswer(offer);
      socket?.emit("call:negotiationdone", answer, socketId);
    };

    const handleCallNegotiationDone = (
      _username: string,
      offer: RTCSessionDescription
    ) => peer.setLocalDescription(offer);

    const handleIceCandidate = (
      _username: string,
      candidate: RTCIceCandidate
    ) => peer.peer.addIceCandidate(candidate);

    const handleDeclinedCall = () => {
      toast({
        description: `Call declined`,
        variant: "destructive",
      });
      clearState();
    };

    socket?.on("call:negotiationneeded", handleIncomeCallNegotiationNeeded);
    socket?.on("call:negotiationdone", handleCallNegotiationDone);
    socket?.on("call:ice-candidate", handleIceCandidate);
    socket?.on("call:declined", handleDeclinedCall);

    return () => {
      socket?.off("call:negotiationneeded", handleIncomeCallNegotiationNeeded);
      socket?.off("call:negotiationdone", handleCallNegotiationDone);
      socket?.off("call:ice-candidate", handleIceCandidate);
      socket?.off("call:declined", handleDeclinedCall);
    };
  }, [socket, peer]);

  const callUser: CallContextType["callUser"] = async (username) => {
    setStatus("calling");
    setCallData({ username });
    const offer = await peer.getOffer();
    socket?.emit("call:outgoing", username, offer);
  };

  const acceptCall: CallContextType["acceptCall"] = async (callData) => {
    setStatus("connected");
    setCallData(callData);
    const answer = await peer.getAnswer(callData.offer);
    socket?.emit("call:accepted", callData.username, answer, callData.socketId);
  };

  const callAccepted: CallContextType["callAccepted"] = async (
    answer,
    socketId,
    username
  ) => {
    setStatus("connected");
    setCallData({ username, socketId, offer: answer });
    await peer.setLocalDescription(answer);
  };

  const sendStreams: CallContextType["sendStreams"] = (stream) => {
    for (const track of stream.getTracks()) {
      peer.peer.addTrack(track, stream);
    }
  };

  const endCall: CallContextType["endCall"] = (isMe) => {
    if (isMe) socket?.emit("call:end", callData?.socketId);
    clearState();
  };

  return (
    <CallContext.Provider
      value={{
        callData,
        status,
        peer: peer.peer,
        callUser,
        acceptCall,
        callAccepted,
        sendStreams,
        endCall,
      }}
    >
      {children}
    </CallContext.Provider>
  );
};

export default CallProvider;
