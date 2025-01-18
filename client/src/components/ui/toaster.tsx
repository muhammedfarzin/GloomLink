import { useToast } from "@/hooks/use-toast";
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";

export function Toaster() {
  const colorTheme = useSelector((state: RootState) => state.theme.colorTheme);
  const { toasts } = useToast();

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, variant, ...props }) {
        return (
          <Toast
            key={id}
            variant={variant}
            {...props}
            style={{
              backgroundColor: variant === "destructive" ? colorTheme.danger : colorTheme.background,
              borderColor: colorTheme.border,
              color: colorTheme.text,
            }}
          >
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose />
          </Toast>
        );
      })}
      <ToastViewport />
    </ToastProvider>
  );
}
