import { injectable, inject } from "inversify";
import { FormValidationError } from "@/domain/errors/FormValidationError";
import { Post } from "@/domain/entities/Post";
import { TYPES } from "@/shared/types";
import type { IPostRepository } from "@/domain/repositories/IPostRepository";
import type { IFileStorageService } from "@/domain/services/IFileStorageService";
import type {
  ICreatePost,
  CreatePostInput,
} from "@/domain/use-cases/ICreatePost";

@injectable()
export class CreatePost implements ICreatePost {
  constructor(
    @inject(TYPES.IPostRepository)
    private postRepository: IPostRepository,
    @inject(TYPES.IFileStorageService)
    private fileStorageService: IFileStorageService,
  ) {}

  async execute(input: CreatePostInput): Promise<Post> {
    if (!input.caption && input.files.length === 0) {
      throw new FormValidationError({ content: "Add a caption or upload an image." });
    }

    // ---Upload media files---
    const uploadedMedia = await this.fileStorageService.upload(
      input.files,
      "posts",
    );
    const imagesPath = uploadedMedia
      .filter((file) => file.mediaType === "image")
      .map((file) => file.url);

    // ---Creating Post---
    const postToCreate = new Post({
      id: crypto.randomUUID(),
      userId: input.userId,
      caption: input.caption,
      images: imagesPath,
      tags: input.tags,
      publishedFor: input.publishedFor ?? "public",
      status: input.status ?? "active",
    });

    const createdPost = await this.postRepository.create(postToCreate);

    return createdPost;
  }
}
