export interface ITogglePostStatus {
  execute(input: TogglePostStatusInput): Promise<TogglePostStatusOutput>;
}

export interface TogglePostStatusInput {
  postId: string;
}

export interface TogglePostStatusOutput {
  updatedStatus: "active" | "blocked";
}
