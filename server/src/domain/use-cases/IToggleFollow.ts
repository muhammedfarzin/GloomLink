export interface IToggleFollow {
  execute(input: ToggleFollowInput): Promise<ToggleFollowResponse>;
}

export interface ToggleFollowInput {
  currentUserId: string;
  targetUserId: string;
}

export interface ToggleFollowResponse {
  status: "followed" | "unfollowed";
}
