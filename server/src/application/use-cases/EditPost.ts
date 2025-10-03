import { injectable, inject } from "inversify";
import { IPostRepository } from "../../domain/repositories/IPostRepository";
import { HttpError } from "../../infrastructure/errors/HttpError";
import { Post } from "../../domain/entities/Post";
import { IFileStorageService } from "../services/IFileStorageService";
import { TYPES } from "../../shared/types";

export interface EditPostInput {
  postId: string;
  userId: string;
  newFiles: Express.Multer.File[];
  removedFiles: string[];
  tags: string[];
  publishedFor: "public" | "subscriber";
  caption?: string | undefined;
}

@injectable()
export class EditPost {
  constructor(
    @inject(TYPES.IPostRepository) private postRepository: IPostRepository,
    @inject(TYPES.IFileStorageService)
    private fileStorageService: IFileStorageService
  ) {}

  async execute(input: EditPostInput): Promise<Post> {
    const { postId, userId, newFiles, removedFiles, ...updates } = input;

    // ---Authorization: Check if the user owns the post---
    const post = await this.postRepository.findById(postId);
    if (!post) {
      throw new HttpError(404, "Post not found or has been deleted");
    }
    if (post.userId.toString() !== userId) {
      throw new HttpError(403, "You are not authorized to edit this post");
    }

    const uploadedMedia = await this.fileStorageService.upload(
      newFiles,
      "posts"
    );
    const newImageUrls = uploadedMedia
      .filter((file) => file.mediaType === "image")
      .map((file) => file.url);
    const remainingImages = post.images.filter(
      (img) => !removedFiles?.includes(img)
    );

    const finalImages = [...remainingImages, ...newImageUrls];

    const updatedPost = await this.postRepository.update(postId, {
      ...updates,
      images: finalImages,
    });

    if (!updatedPost) {
      throw new HttpError(500, "Failed to update the post");
    }

    if (removedFiles.length > 0) {
      await this.fileStorageService.delete(removedFiles, "image");
    }

    return updatedPost;
  }
}
