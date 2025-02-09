import { useToast } from "./use-toast";

export const toastError = (message?: string) => {
  const { toast } = useToast();

  toast({
    description: message || "Something went wrong",
    variant: "destructive",
  });
};
