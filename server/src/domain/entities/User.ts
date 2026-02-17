import { UserSelfBlockError } from "../errors/UserSelfBlockError";
import { DateOfBirth } from "../value-objects/DateOfBirth";
import { Email } from "../value-objects/Email";
import { MobileNumber } from "../value-objects/MobileNumber";
import { PasswordHash } from "../value-objects/PasswordHash";
import { Url } from "../value-objects/Url";
import { UserGender } from "../value-objects/UserGender";
import { Username } from "../value-objects/Username";

export class User {
  private readonly userId: string;
  private username: Username;
  private passwordHash: PasswordHash;
  private firstname: string;
  private lastname: string;
  private email: Email;
  private mobile: MobileNumber | undefined;
  private readonly authType: "email" | "google";
  private status: "active" | "inactive" | "blocked" | "not-verified";
  private imageUrl: Url | null;
  private gender: UserGender | undefined;
  private dob: DateOfBirth | undefined;
  private readonly blockedUsers: Set<string>;
  private readonly savedPosts: Set<string>;
  private readonly interestKeywords: Set<string>;

  constructor(userParams: UserType) {
    this.userId = userParams.userId;
    this.username = new Username(userParams.username);
    this.firstname = userParams.firstname;
    this.lastname = userParams.lastname ?? "";
    this.email = new Email(userParams.email);
    this.authType = userParams.authType;
    this.status = userParams.status;
    this.passwordHash = new PasswordHash(userParams.passwordHash);
    this.blockedUsers = new Set(userParams.blockedUsers ?? []);
    this.savedPosts = new Set(userParams.savedPosts ?? []);
    this.interestKeywords = new Set(userParams.interestKeywords ?? []);
    this.dob = userParams.dob && new DateOfBirth(userParams.dob);
    this.mobile = userParams.mobile
      ? new MobileNumber(userParams.mobile)
      : undefined;
    this.imageUrl = userParams.imageUrl ? new Url(userParams.imageUrl) : null;
    this.gender = userParams.gender
      ? new UserGender(userParams.gender)
      : undefined;
  }

  // ---------------- SETTERS ----------------

  changeUsername(username: string) {
    this.username = new Username(username);
  }

  updatePasswordHash(passwordHash: string) {
    this.passwordHash = new PasswordHash(passwordHash);
  }

  changeName(firstname: string, lastname?: string) {
    if (!firstname.trim()) {
      throw new Error("First name is required");
    }

    this.firstname = firstname;
    this.lastname = lastname ?? "";
  }

  updateImage(imageUrl: string | null) {
    this.imageUrl = imageUrl ? new Url(imageUrl) : null;
  }

  updateEmail(email: string) {
    this.email = new Email(email);
  }

  updateMobile(mobile: string) {
    this.mobile = new MobileNumber(mobile);
  }

  updateDateOfBirth(dob: UserType["dob"]) {
    this.dob = dob && new DateOfBirth(dob);
  }

  updateGender(gender: UserType["gender"]) {
    this.gender = gender && new UserGender(gender);
  }

  updateStatus(status: UserType["status"]) {
    this.status = status;
  }

  // ---------- Collection Setters -----------

  blockUser(userId: string) {
    if (this.userId === userId) {
      throw new UserSelfBlockError();
    }
    this.blockedUsers.add(userId);
  }

  unblockUser(userId: string) {
    this.blockedUsers.delete(userId);
  }

  savePost(postId: string) {
    this.savedPosts.add(postId);
  }

  unsavePost(postId: string) {
    this.savedPosts.delete(postId);
  }

  // ---------------- GETTERS ----------------

  getId(): UserType["userId"] {
    return this.userId;
  }

  getUsername(): UserType["username"] {
    return this.username.getValue();
  }

  getEmail(): UserType["email"] {
    return this.email.getValue();
  }

  getMobile(): UserType["mobile"] {
    return this.mobile?.getValue();
  }

  getFirstName(): UserType["firstname"] {
    return this.firstname;
  }

  getLastName(): UserType["lastname"] {
    return this.lastname;
  }

  getFullName(): string {
    return `${this.firstname} ${this.lastname}`.trim();
  }

  getPasswordHash(): UserType["passwordHash"] {
    return this.passwordHash.getValue();
  }

  getAuthType(): UserType["authType"] {
    return this.authType;
  }

  getStatus(): UserType["status"] {
    return this.status;
  }

  getGender(): UserType["gender"] {
    return this.gender?.getValue();
  }

  getDateOfBirth(): UserType["dob"] {
    return this.dob?.getValue();
  }

  getImageUrl(): UserType["imageUrl"] {
    return this.imageUrl?.getValue();
  }

  // -------- Collection getters --------

  getBlockedUsers(): string[] {
    return Array.from(this.blockedUsers);
  }

  getSavedPosts(): string[] {
    return Array.from(this.savedPosts);
  }

  getInterestKeywords(): string[] {
    return Array.from(this.interestKeywords);
  }

  // --------- Boolean helpers ---------

  isActive(): boolean {
    return this.status === "active";
  }

  isBlocked(): boolean {
    return this.status === "blocked";
  }

  isVerified(): boolean {
    return this.status !== "not-verified";
  }

  hasBlocked(userId: string): boolean {
    return this.blockedUsers.has(userId);
  }

  hasSavedPost(postId: string): boolean {
    return this.savedPosts.has(postId);
  }
}

interface UserType {
  userId: string;
  username: string;
  passwordHash: string;
  firstname: string;
  lastname?: string;
  email: string;
  mobile?: string;
  authType: "email" | "google";
  status: "active" | "inactive" | "blocked" | "not-verified";
  imageUrl?: string;
  gender?: "m" | "f";
  dob?: Date;
  blockedUsers?: readonly string[];
  savedPosts?: readonly string[];
  interestKeywords?: readonly string[];
}
