export type MessageType = {
  _id: string;
  message?: string;
  image?: string;
  type: "text" | "image" | "post";
  to?: string;
  createdAt: string;
} & (
  | { from: string; status: "sent" | "seen" }
  | { from?: null; status: "pending" }
);
