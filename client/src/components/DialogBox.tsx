import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

interface DialogBoxProps {
  children: React.ReactNode;
  dialogElement: React.ReactNode;
  title: string;
  dialogClassName?: string;
}

const DialogBox: React.FC<DialogBoxProps> = ({
  children,
  dialogElement,
  title,
  dialogClassName = "",
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent
        className={`flex flex-col w-full md:w-80 h-full md:max-h-[80vh] p-4 ${dialogClassName}`}
      >
        <DialogHeader>
          <DialogTitle className="capitalize">{title}</DialogTitle>
        </DialogHeader>

        {dialogElement}
      </DialogContent>
    </Dialog>
  );
};

export default DialogBox;
