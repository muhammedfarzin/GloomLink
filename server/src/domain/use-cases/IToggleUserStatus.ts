export interface IToggleUserStatus {
  execute(userId: string): Promise<ToggleUserStatusResponse>;
}

interface ToggleUserStatusResponse {
  updatedStatus: string;
}
