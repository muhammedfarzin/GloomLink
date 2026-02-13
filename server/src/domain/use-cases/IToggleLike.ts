export interface IToggleLike {
  execute(input: ToggleLikeInput): Promise<ToggleLikeOutput>;
}

export interface ToggleLikeInput {
  targetId: string;
  userId: string;
  type: "post";
}

export interface ToggleLikeOutput {
  status: "liked" | "unliked";
}
