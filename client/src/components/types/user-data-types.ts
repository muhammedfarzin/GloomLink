export interface UserDataType {
  userId: string;
  username: string;
  firstname: string;
  lastname: string;
  imageUrl?: string;
  isFollowing?: boolean;
}

export type ChatUserDataType = Omit<UserDataType, "isFollowing"> & {
  unread?: number;
};
