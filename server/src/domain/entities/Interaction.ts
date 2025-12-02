export interface Interaction {
  _id: string;
  userId: string;
  postId: string;
  type: "view" | "like" | "comment" | "save";
  weight: number;
  createdAt: Date;
}
