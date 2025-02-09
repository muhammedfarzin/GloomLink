import IconButton from "@/components/IconButton";
import InputBox from "@/components/InputBox";
import PaperPlaneIcon from "@/assets/icons/PaperPlane.svg";
import { useState } from "react";
import { toastError } from "@/hooks/toast";

interface MessageInputProps {
  onSubmit?: (message: {
    message?: string;
    image?: string;
    type: "text" | "image";
  }) => void;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSubmit }) => {
  const [message, setMessage] = useState<string>("");

  const handleSubmit = () => {
    if (!message.trim()) return toastError("Please enter a message");

    onSubmit?.({ message, type: "text" });
    setMessage("");
  };

  return (
    <div className="bg-secondary/75 border-t border-border w-full flex gap-2 items-center px-2 py-1">
      <InputBox
        placeholder="Message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            handleSubmit();
          }
        }}
      />
      <IconButton icon={PaperPlaneIcon} alt="send" onClick={handleSubmit} />
    </div>
  );
};

export default MessageInput;
