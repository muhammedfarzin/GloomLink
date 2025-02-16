import DialogBox from "@/components/DialogBox";
import { useSocket } from "@/hooks/use-socket";
import { useEffect, useState } from "react";
import IncomeCallCard from "./IncomeCallCard";
import { useNavigate } from "react-router-dom";
import type { IncomeCallType } from "@/context/CallContext";
import { useCall } from "@/hooks/use-call";

const IncomeCallListener: React.FC = () => {
  const socket = useSocket();
  const navigate = useNavigate();
  const callHandler = useCall();
  const [incomeCall, setIncomeCall] = useState<Required<IncomeCallType> | null>(
    null
  );

  useEffect(() => {
    const handleIncomeCall = (
      username: string,
      offer: RTCSessionDescriptionInit,
      socketId: string
    ) => setIncomeCall({ username, offer, socketId });

    socket?.on("call:incoming", handleIncomeCall);
    return () => {
      socket?.off("call:incoming", handleIncomeCall);
    };
  }, [socket]);

  const handleAcceptCall = () => {
    if (incomeCall) {
      callHandler?.acceptCall(incomeCall);
      setIncomeCall(null);
      navigate("/call");
    }
  };

  const handleCancelCall = () => {
    socket?.emit("call:declined", incomeCall?.socketId);
    setIncomeCall(null);
  };

  return (
    <DialogBox
      closeClassName="hidden"
      open={!!incomeCall}
      dialogElement={
        <IncomeCallCard
          username={incomeCall?.username!}
          onCancel={handleCancelCall}
          onAccept={handleAcceptCall}
        />
      }
    />
  );
};

export default IncomeCallListener;
