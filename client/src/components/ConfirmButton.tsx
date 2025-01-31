import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "./ui/button";
import React, { useRef } from "react";

interface ConfirmButtonProps {
  children: React.ReactElement;
  onSuccess?: React.MouseEventHandler<HTMLButtonElement>;
  onCancel?: React.MouseEventHandler<HTMLButtonElement>;
  title?: string;
  description?: string;
  confirmButtonText?: string;
  className?: string;
}

const ConfirmButton: React.FC<ConfirmButtonProps> = ({
  children,
  onSuccess,
  onCancel,
  title,
  description,
  confirmButtonText,
  className,
}) => {
  const alertBtnRef = useRef<HTMLButtonElement | null>(null);
  const { onClick: childOnClick, ...childProps } = children.props;

  return (
    <AlertDialog>
      <AlertDialogTrigger className={className}>
        <children.type
          onClick={(e: React.MouseEvent) => {
            e.preventDefault();
            childOnClick?.();
            alertBtnRef.current?.click();
          }}
          {...childProps}
        />
        <Button ref={alertBtnRef} className="hidden" />
      </AlertDialogTrigger>

      <AlertDialogContent className="border-none bg-background text-foreground">
        <AlertDialogHeader>
          <AlertDialogTitle>{title || "Are you sure?"}</AlertDialogTitle>
          {description ? (
            <AlertDialogDescription>{description}</AlertDialogDescription>
          ) : null}
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel
            className="border-gray-500 hover:opacity-75 transition-all bg-background text-foreground"
            onClick={onCancel}
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onSuccess}
            className="text-foreground bg-primary"
          >
            {confirmButtonText || "Continue"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ConfirmButton;
