import { ValidationError } from "../errors/ValidationError";
import { DateOfBirth } from "../value-objects/DateOfBirth";
import { Email } from "../value-objects/Email";
import { MobileNumber } from "../value-objects/MobileNumber";
import { PasswordHash } from "../value-objects/PasswordHash";
import { Url } from "../value-objects/Url";
import { UserGender } from "../value-objects/UserGender";
import { Username } from "../value-objects/Username";
import { UserStatus } from "../value-objects/UserStatus";
import { UserStatusType } from "../models/User";
import { BaseEntity } from "./BaseEntity";

export class User extends BaseEntity {
  private username: Username;
  private passwordHash: PasswordHash;
  private firstname: string;
  private lastname: string;
  private email: Email;
  private mobile: MobileNumber | undefined;
  private readonly authType: "email" | "google";
  private status: UserStatus;
  private imageUrl: Url | null;
  private gender: UserGender | undefined;
  private dob: DateOfBirth | undefined;
  private readonly blockedUsers: Set<string>;
  private readonly interestKeywords: Set<string>;
  private isSelf: boolean | undefined;
  private isFollowing: boolean | undefined;

  constructor(props: UserType) {
    super(props);
    this.username = new Username(props.username);
    this.firstname = props.firstname;
    this.lastname = props.lastname ?? "";
    this.email = new Email(props.email);
    this.authType = props.authType;
    this.status = new UserStatus(props.status);
    this.passwordHash = new PasswordHash(props.passwordHash);
    this.blockedUsers = new Set(props.blockedUsers ?? []);
    this.interestKeywords = new Set(props.interestKeywords ?? []);
    this.dob = props.dob && new DateOfBirth(props.dob);
    this.mobile = props.mobile ? new MobileNumber(props.mobile) : undefined;
    this.imageUrl = props.imageUrl ? new Url(props.imageUrl) : null;
    this.gender = props.gender ? new UserGender(props.gender) : undefined;
    this.isSelf = props.isSelf;
    this.isFollowing = props.isFollowing;

    if (props.isSelf) {
      delete this.isFollowing;
    }
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
    this.status = new UserStatus(status);
  }

  setSelf() {
    if (this.isSelf === null) {
      this.isSelf = true;
      delete this.isFollowing;
    }
  }

  // ---------- Collection Setters -----------

  blockUser(userId: string) {
    if (this.isId(userId)) {
      throw new ValidationError("User cannot block themselves");
    }
    this.blockedUsers.add(userId);
  }

  unblockUser(userId: string) {
    this.blockedUsers.delete(userId);
  }

  // ---------------- GETTERS ----------------

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
    return this.status.getValue();
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

  getInterestKeywords(): string[] {
    return Array.from(this.interestKeywords);
  }

  // --------- Boolean helpers ---------

  isActive(): boolean {
    return this.status.getValue() === "active";
  }

  isBlocked(): boolean {
    return this.status.getValue() === "blocked";
  }

  isVerified(): boolean {
    return this.status.getValue() !== "not-verified";
  }

  hasBlocked(userId: string): boolean {
    return this.blockedUsers.has(userId);
  }

  isSelfUser(): boolean | undefined {
    return this.isSelf;
  }

  isFollowingUser(): boolean | undefined {
    if (!this.isSelf) return this.isFollowing;
  }
}

interface UserType {
  id: string;
  username: string;
  passwordHash: string;
  firstname: string;
  lastname?: string;
  email: string;
  mobile?: string;
  authType: "email" | "google";
  status: UserStatusType;
  imageUrl?: string;
  gender?: "m" | "f";
  dob?: Date;
  blockedUsers?: readonly string[];
  interestKeywords?: readonly string[];
  isSelf?: boolean;
  isFollowing?: boolean;
}
