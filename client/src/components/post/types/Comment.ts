export default interface Comment {
  id: string;
  comment: string;
  targetId: string;
  userId: string;
  type: "post";
  repliesCount: number;
  uploadedBy: {
    id: string;
    firstname: string;
    lastname: string;
    username: string;
    image?: string;
  };
  createdAt: string;
  updatedAt: string;
}
