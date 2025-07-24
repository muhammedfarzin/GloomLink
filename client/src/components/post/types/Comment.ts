export default interface Comment {
  _id: string;
  comment: string;
  targetId: string;
  userId: string;
  type: "post";
  replies: number;
  uploadedBy: {
    _id: string;
    firstname: string;
    lastname: string;
    username: string;
    image?: string;
  };
}
