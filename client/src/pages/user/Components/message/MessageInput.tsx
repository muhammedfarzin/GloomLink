import IconButton from "@/components/IconButton";
import InputBox from "@/components/InputBox";
import PaperPlaneIcon from "@/assets/icons/PaperPlane.svg";
import { toastError } from "@/hooks/toast";

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
  const handleSubmit = () => {
    if (!value?.trim()) return toastError("Please enter a message");

    onSubmit?.({ message: value, type: "text" });
    onChange?.("");
  };

  return (
    <div className="bg-secondary/75 border-t border-border w-full flex gap-2 items-center px-2 py-1">
      <InputBox
        placeholder="Message"
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
