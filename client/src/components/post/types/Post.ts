export interface Post {
  postId: string;
  userId: string;
  caption: string;
  images: string[];
  tags: string[];
  publishedFor: "public" | "subscriber";
  createdAt: string;
  updatedAt: string;
  isSaved?: boolean;
  isLiked?: boolean;
  status?: "active" | "blocked" | "deleted";
  likesCount?: number;
  commentsCount?: number;
  uploadedBy: {
    userId: string;
    firstname: string;
    lastname: string;
    username: string;
    imageUrl?: string;
  };
  reportCount?: number;
}
