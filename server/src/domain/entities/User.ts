export interface User {
  _id: string;
  username: string;
  password: string;
  firstname: string;
  lastname: string;
  email: string;
  mobile: string;
  authType?: "email" | "google";
  status: "active" | "inactive" | "blocked" | "not-verified";
  image?: string;
  gender?: string;
  dob?: Date;
  blockedUsers: string[];
  savedPosts: string[];
  subscriptionAmount?: number;
  interestKeywords: string[];
}
