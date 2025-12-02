import { useCallback } from "react";
import { apiClient } from "@/apiClient";

export const useInteraction = () => {
  const recordInteraction = useCallback(
    async (postId: string, type: "view" | "like" | "comment" | "save") => {
      try {
        await apiClient.post("/posts/interaction", { postId, type });
      } catch (error) {
        console.error("Failed to record interaction:", error);
      }
    },
    []
  );

  return { recordInteraction };
};
