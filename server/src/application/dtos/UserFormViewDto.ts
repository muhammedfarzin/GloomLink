export interface UserFormViewDto {
  _id: string;
  username: string;
  firstname: string;
  lastname: string;
  email: string;
  mobile: string;
  authType: "email" | "google";
  dob?: Date;
  gender?: string;
  image?: string;
}