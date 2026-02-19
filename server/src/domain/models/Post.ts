export interface PostCompact {
  postId: string;
  userId: string;
  caption?: string | null;
  images?: string[];
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface PostType extends PostCompact {
  publishedFor: "public" | "subscriber";
  status: "active" | "blocked" | "deleted";
}

export interface EnrichedPost extends PostCompact {
  likesCount: number;
  commentsCount: number;
  isLiked?: boolean;
  isSaved?: boolean;
  reportCount?: number;
  uploadedBy: {
    userId: string;
    username: string;
    firstname: string;
    lastname: string;
    imageUrl?: string;
  };
  type: "post";
}
