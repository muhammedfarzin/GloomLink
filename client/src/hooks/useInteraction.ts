import { useCallback } from "react";
import { apiClient } from "@/apiClient";

export const useInteraction = () => {
  const recordInteraction = useCallback(
    async (postId: string, action: "view") => {
      try {
        await apiClient.post("/posts/record-activity", { postId, action });
      } catch (error) {
        console.error("Failed to record activity:", error);
      }
    },
    [],
  );

  return { recordInteraction };
};
