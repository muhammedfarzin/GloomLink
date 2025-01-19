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
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

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
  const colorTheme = useSelector((state: RootState) => state.theme.colorTheme);
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

      <AlertDialogContent
        className="border-none"
        style={{ color: colorTheme.text, background: colorTheme.background }}
      >
        <AlertDialogHeader>
          <AlertDialogTitle>{title || "Are you sure?"}</AlertDialogTitle>
          {description ? (
            <AlertDialogDescription>{description}</AlertDialogDescription>
          ) : null}
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel
            className="border-gray-500 hover:opacity-75 transition-all"
            onClick={onCancel}
            style={{
              color: colorTheme.text,
              background: colorTheme.background,
            }}
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onSuccess}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor =
                colorTheme.primary + "bb")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = colorTheme.primary)
            }
            style={{ color: colorTheme.text, background: colorTheme.primary }}
          >
            {confirmButtonText || "Continue"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ConfirmButton;
