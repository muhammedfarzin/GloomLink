import { IPostRepository } from "../../domain/repositories/IPostRepository";
import { IFileStorageService } from "../services/IFileStorageService";
import { Post } from "../../domain/entities/Post";
import { HttpError } from "../../infrastructure/errors/HttpError";

export interface CreatePostInput {
  userId: string;
  caption?: string;
  files: Express.Multer.File[];
  tags: string[];
  publishedFor?: "public" | "subscriber";
}

export class CreatePost {
  constructor(
    private postRepository: IPostRepository,
    private fileStorageService: IFileStorageService
  ) {}

  async execute(input: CreatePostInput): Promise<Post> {
    if (!input.caption && input.files.length === 0) {
      throw new HttpError(400, "Post must have either a caption or an image.");
    }

    // ---Upload media files---
    const uploadedMedia = await this.fileStorageService.upload(
      input.files,
      "posts"
    );
    const imagesPath: string[] = [];

    uploadedMedia.forEach((media) => {
      if (media.mediaType === "image") imagesPath.push(media.url);
    });

    // ---Creating Post---
    const postToCreate: Partial<Post> = {
      userId: input.userId,
      caption: input.caption,
      images: imagesPath,
      tags: input.tags,
      publishedFor: input.publishedFor,
    };

    const createdPost = await this.postRepository.create(postToCreate);

    return createdPost;
  }
}
