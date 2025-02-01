import IconButton from "@/components/IconButton";
import InputBox from "@/components/InputBox";
import PaperPlaneIcon from "@/assets/icons/PaperPlane.svg";

const MessageInput: React.FC = () => {
  return (
    <div className="bg-secondary/75 border-t border-border w-full flex gap-2 items-center px-2 py-1">
      <InputBox placeholder="Message" />
      <IconButton icon={PaperPlaneIcon} alt="send" />
    </div>
  );
};

export default MessageInput;
