export interface UserDataType {
  _id: string;
  username: string;
  firstname: string;
  lastname: string;
  image?: string;
  isFollowing?: boolean;
}

export type ChatUserDataType = Omit<UserDataType, "isFollowing"> & {
  unread?: number;
};
