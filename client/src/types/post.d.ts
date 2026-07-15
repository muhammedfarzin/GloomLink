export interface CompactPost {
  id: string;
  userId: string;
  caption: string;
  images: string[];
  isSaved?: boolean;
  isLiked?: boolean;
  status?: "active" | "blocked" | "deleted";
  likesCount?: number;
  commentsCount?: number;
  reportCount?: number;
  createdAt: string;
  updatedAt: string;
  uploadedBy: {
    id: string;
    firstname: string;
    lastname: string;
    username: string;
    imageUrl?: string;
  };
  type: "post";
}

export interface Post extends CompactPost {
  tags: string[];
  publishedFor: "public" | "subscriber";
}
