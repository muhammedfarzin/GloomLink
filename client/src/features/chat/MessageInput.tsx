import IconButton from "@/components/IconButton";
import PaperPlaneIcon from "@/assets/icons/PaperPlane.svg";
import { useToaster } from "@/hooks/useToaster";

interface MessageInputProps {
  value?: string;
  onChange?: (value: string) => void;
  onSubmit?: (message: {
    message?: string;
    image?: string;
    type: "text" | "image";
  }) => void;
}

const MessageInput: React.FC<MessageInputProps> = ({
  value,
  onChange,
  onSubmit,
}) => {
  const { toastError } = useToaster();

  const handleSubmit = () => {
    if (!value?.trim()) return toastError("Please enter a message");

    onSubmit?.({ message: value, type: "text" });
    onChange?.("");
  };

  return (
    <div className="bg-secondary/75 border-t border-border w-full flex gap-2 items-center px-2 py-1">
      <input
        placeholder="Message"
        className="input-box"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
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
