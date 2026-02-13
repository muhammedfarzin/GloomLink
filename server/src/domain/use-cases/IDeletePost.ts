export interface IDeletePost {
  execute(input: DeletePostInput): Promise<void>;
}

export interface DeletePostInput {
  postId: string;
  userId: string;
  userRole: "user" | "admin";
}
