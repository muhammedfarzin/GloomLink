export interface Post {
  _id: string;
  userId: string;
  caption: string;
  images: string[];
  tags: string[];
  publishedFor: "public" | "subscriber";
  createdAt: string;
  isSaved?: boolean;
  isLiked?: boolean;
  status?: "active" | "blocked" | "deleted";
  likesCount?: number;
  commentsCount?: number;
  uploadedBy: {
    _id: string;
    firstname: string;
    lastname: string;
    username: string;
    image?: string;
  };
  reportCount?: number;
}
