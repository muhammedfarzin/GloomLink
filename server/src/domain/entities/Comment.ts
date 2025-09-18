export interface Comment {
  _id: string;
  targetId: string;
  userId: string;
  comment: string;
  type: "post" | "comment";
}
