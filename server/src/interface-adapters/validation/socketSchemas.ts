import { z } from "zod";
import { isValidObjectId, validateRequiredString } from "./validations";

export const sendMessageSchema = z
  .object({
    conversationId: z
      .string(validateRequiredString("Conversation ID"))
      .trim()
      .min(1, { message: "Conversation ID is required" })
      .refine(isValidObjectId, { message: "Invalid Conversation ID" }),
    message: z.string().trim().optional(),
    image: z.url({ message: "Invalid image URL" }).optional(),
    type: z.enum(["text", "image", "post"], {
      message: "Invalid message type",
    }),
  })
  .refine((data) => data.message || data.image, {
    message: "Message or image, either one is required",
    path: ["message"],
  });

export type SendMessageInputDto = z.infer<typeof sendMessageSchema>;

const seenMessageSchema = z.object({
  messageId: z
    .string({ message: "Invalid message ID format" })
    .refine((val) => isValidObjectId(val), {
      message: "Invalid message ID format",
    }),
  from: z
    .string(validateRequiredString("Sender username ('from')"))
    .min(1, { message: "Sender username ('from') is required" }),
});

export const markAsSeenSchema = z.array(seenMessageSchema);

export type MarkAsSeenInputDto = z.infer<typeof markAsSeenSchema>;
