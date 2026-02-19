import { injectable, inject } from "inversify";
import { IPostRepository } from "../../domain/repositories/IPostRepository";
import { HttpError } from "../../infrastructure/errors/HttpError";
import { Post } from "../../domain/entities/Post";
import { IFileStorageService } from "../../domain/services/IFileStorageService";
import {
  IEditPost,
  type EditPostInput,
} from "../../domain/use-cases/IEditPost";
import { TYPES } from "../../shared/types";

@injectable()
export class EditPost implements IEditPost {
  constructor(
    @inject(TYPES.IPostRepository) private postRepository: IPostRepository,
    @inject(TYPES.IFileStorageService)
    private fileStorageService: IFileStorageService,
  ) {}

  async execute(input: EditPostInput): Promise<Post> {
    const { postId, removedFiles } = input;

    // ---Authorization: Check if the user owns the post---
    const post = await this.postRepository.findById(postId);
    if (!post) {
      throw new HttpError(404, "Post not found or has been deleted");
    }
    if (post.getUserId() !== input.userId) {
      throw new HttpError(403, "You are not authorized to edit this post");
    }

    const uploadedMedia = await this.fileStorageService.upload(
      input.newFiles,
      "posts",
    );
    const newImageUrls = uploadedMedia
      .filter((file) => file.mediaType === "image")
      .map((file) => file.url);

    post.updateCaption(input.caption);
    post.updateTags(input.tags);
    post.updatePublishedFor(input.publishedFor);
    removedFiles.forEach((imgUrl) => post.removeImage(imgUrl));
    newImageUrls.forEach((imgUrl) => post.addImage(imgUrl));

    const updatedPost = await this.postRepository.update(postId, post);

    if (!updatedPost) {
      throw new HttpError(500, "Failed to update the post");
    }

    if (removedFiles.length > 0) {
      await this.fileStorageService.delete(removedFiles, "image");
    }

    return updatedPost;
  }
}
