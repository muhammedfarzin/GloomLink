import { Post } from "@/domain/entities/Post";
import type { EnrichedPost, PostType } from "@/domain/models/Post";
import type { PostDocument } from "../database/models/PostModel";

export class PostMapper {
  public static toDomain(data: PostType | PostDocument): Post {
    return new Post({
      id: data.id?.toString(),
      userId: data.userId?.toString(),
      images: data.images,
      caption: data.caption,
      tags: data.tags,
      publishedFor: data.publishedFor,
      status: data.status,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    });
  }

  public static toPersistence(post: Post): PostType {
    return {
      id: post.getId(),
      userId: post.getUserId(),
      caption: post.getCaption(),
      images: post.getImages(),
      tags: post.getTags(),
      publishedFor: post.getPublishedFor(),
      status: post.getStatus(),
      createdAt: post.getCreatedAt(),
      updatedAt: post.getUpdatedAt(),
    };
  }

  public static toResponse(data: any): EnrichedPost {
    return {
      id: data.id?.toString(),
      userId: data.userId?.toString(),
      images: data.images,
      caption: data.caption,
      tags: data.tags,
      isLiked: data.isLiked,
      isSaved: data.isSaved,
      commentsCount: data.commentsCount,
      likesCount: data.likesCount,
      reportCount: data.reportCount,
      uploadedBy: {
        id: data.uploadedBy?.id?.toString(),
        firstname: data.uploadedBy?.firstname,
        lastname: data.uploadedBy?.lastname,
        username: data.uploadedBy?.username,
        imageUrl: data.uploadedBy?.imageUrl,
      },
      publishedFor: data.publishedFor,
      status: data.status,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      type: "post",
    };
  }
}
