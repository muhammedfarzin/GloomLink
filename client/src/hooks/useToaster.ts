import { useToast } from "./use-toast";

export const useToaster = () => {
  const { toast } = useToast();

  const toastError = (message?: string) => {
    toast({
      description: message || "Something went wrong",
      variant: "destructive",
    });
  };

  const toastMessage = (message: string) => {
    toast({
      description: message,
    });
  };

  return { toastError, toastMessage };
};
