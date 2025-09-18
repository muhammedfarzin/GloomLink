export interface Report {
  _id: string;
  type: "post" | "user";
  targetId: string;
  reportedBy: string;
}
