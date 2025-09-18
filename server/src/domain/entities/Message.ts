export interface Message {
  _id: string;
  conversation: string;
  message: string;
  image: string;
  from: string;
  status: "sent" | "delivered" | "seen";
  type: "text" | "image" | "post";
}
