export interface IToggleSavePost {
  execute(input: ToggleSavePostInput): Promise<ToggleSavePostOutput>;
}

export interface ToggleSavePostInput {
  userId: string;
  postId: string;
}

export interface ToggleSavePostOutput {
  status: "saved" | "unsaved";
}
