import type { PostType } from "../models/Post";
import { Url } from "../value-objects/Url";

export class Post {
  private readonly postId: string;
  private readonly userId: string;
  private caption?: string | null;
  private images: Url[];
  private readonly removedImages: Set<string>;
  private tags: Set<string>;
  private publishedFor: PostType["publishedFor"];
  private status: PostType["status"];
  private createdAt: Date;
  private updatedAt: Date;

  constructor(props: PostProps) {
    if (!this.caption && (!props.images || props.images.length === 0)) {
      throw new Error("Post must have either a caption or an image");
    }

    this.postId = props.postId;
    this.userId = props.userId;
    this.caption = props.caption;
    this.images = (props.images ?? []).map((imageUrl) => new Url(imageUrl));
    this.removedImages = new Set([]);
    this.tags = new Set(props.tags ?? []);
    this.publishedFor = props.publishedFor;
    this.status = props.status;
    this.createdAt = props.createdAt ?? new Date();
    this.updatedAt = props.updatedAt ?? this.createdAt;
  }

  // ---------------- SETTERS ----------------

  updateCaption(caption?: string) {
    this.caption = caption ?? null;
  }

  updateImages(images: string[]) {
    this.images = images.map((imageUrl) => new Url(imageUrl));
  }

  updateTags(tags: string[]) {
    this.tags = new Set(tags);
  }

  updatePublishedFor(publishedFor: PostType["publishedFor"]) {
    this.publishedFor = publishedFor;
  }

  updateStatus(status: PostType["status"]) {
    this.status = status;
  }

  // ---------- Collection Setters -----------

  addTag(tag: string) {
    this.tags.add(tag);
  }

  removeTag(tag: string) {
    this.tags.delete(tag);
  }

  addImage(imageUrl: string) {
    const newImage = new Url(imageUrl);
    if (
      !this.images.some((image) => image.getValue() === newImage.getValue())
    ) {
      this.images.push(newImage);
    }
  }

  removeImage(imageUrl: string) {
    const imgLengh = this.images.length;
    this.images = this.images.filter((image) => image.getValue() !== imageUrl);
    if (imgLengh > this.images.length) {
      this.removedImages.add(imageUrl);
    }
  }

  // ---------------- GETTERS ----------------

  getPostId(): PostType["postId"] {
    return this.postId;
  }

  getUserId(): PostType["userId"] {
    return this.userId;
  }

  getCaption(): PostType["caption"] {
    return this.caption;
  }

  getImages(): string[] {
    return this.images.map((image) => image.getValue());
  }

  getPublishedFor(): PostType["publishedFor"] {
    return this.publishedFor;
  }

  getStatus(): PostType["status"] {
    return this.status;
  }

  getCreatedAt(): PostType["createdAt"] {
    return this.createdAt;
  }

  getUpdatedAt(): PostType["updatedAt"] {
    return this.updatedAt;
  }

  // -------- Collection getters --------

  getTags(): string[] {
    return Array.from(this.tags);
  }

  // --------- Boolean helpers ---------

  isForPublic(): boolean {
    return this.publishedFor === "public";
  }

  isForSubscribers(): boolean {
    return this.publishedFor === "subscriber";
  }

  isActive(): boolean {
    return this.status === "active";
  }

  isBlocked(): boolean {
    return this.status === "blocked";
  }

  isDeleted(): boolean {
    return this.status === "deleted";
  }
}

type PostProps = Omit<PostType, "createdAt" | "updatedAt"> & {
  createdAt?: PostType["createdAt"];
  updatedAt?: PostType["updatedAt"];
};
