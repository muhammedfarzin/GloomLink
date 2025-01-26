import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useEffect, useRef } from "react";
import { Cropper, type ReactCropperElement } from "react-cropper";

interface CropperDialogBoxProps {
  cropperRef?: React.LegacyRef<HTMLImageElement | ReactCropperElement>;
  cropImage?: string;
  title?: string;
  description?: string;
  show?: boolean;
  onDone?: () => void;
  onClose?: () => void;
}

const CropperDialogBox: React.FC<CropperDialogBoxProps> = ({
  cropperRef,
  cropImage,
  title,
  description,
  show,
  onDone,
  onClose,
}) => {
  const showBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (show) showBtnRef.current?.click();
  }, [show]);

  return (
    <Dialog onOpenChange={(isOpen) => (!isOpen ? onClose?.() : null)}>
      <DialogTrigger asChild>
        <Button ref={showBtnRef} variant="outline" className="hidden" />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          {title ? <DialogTitle>{title}</DialogTitle> : null}
          {description ? (
            <DialogDescription>{description}</DialogDescription>
          ) : null}
        </DialogHeader>

        <Cropper
          ref={cropperRef}
          src={cropImage as string}
          style={{ height: 300, width: "100%" }}
          initialAspectRatio={1}
          aspectRatio={1}
          guides={false}
          viewMode={1}
        />

        <DialogFooter>
          <DialogClose>
            <Button type="button" variant="secondary">
              Close
            </Button>
            <Button type="submit" onClick={onDone}>
              Done
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CropperDialogBox;
