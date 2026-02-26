import type { PostResponseDto } from "../../application/dtos/PostDto";
import type { Post } from "../../domain/entities/Post";

export class PostPresenter {
  public static toResponse(post: Post): PostResponseDto {
    const images = post.getImages();

    return {
      postId: post.getPostId(),
      userId: post.getUserId(),
      caption: post.getCaption(),
      images: images.length ? images : undefined,
      tags: post.getTags(),
      publishedFor: post.getPublishedFor(),
      status: post.getStatus(),
      createdAt: post.getCreatedAt(),
      updatedAt: post.getUpdatedAt(),
    };
  }
}
