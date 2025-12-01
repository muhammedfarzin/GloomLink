export interface Post {
  _id: string;
  userId: string;
  caption?: string;
  images: string[];
  tags: string[];
  publishedFor: "public" | "subscriber";
  status: "active" | "blocked" | "deleted";
  createdAt: Date;
  updatedAt: Date;
}
