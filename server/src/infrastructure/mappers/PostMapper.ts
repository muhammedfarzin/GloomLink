import { Post } from "../../domain/entities/Post";
import type { UserProfileResponseDto } from "../../application/dtos/UserDto";
import type {
  EnrichedPost,
  PostCompact,
  PostType,
} from "../../domain/models/Post";

export class PostMapper {
  public static toDomain(data: PostType): Post {
    return new Post(data);
  }

  public static toPersistence(post: Post): PostType {
    return {
      postId: post.getPostId(),
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
      postId: data.postId?.toString(),
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
        userId: data.uploadedBy?.userId?.toString(),
        firstname: data.uploadedBy?.firstname,
        lastname: data.uploadedBy?.lastname,
        username: data.uploadedBy?.username,
        imageUrl: data.uploadedBy?.imageUrl,
      },
      publishedFor: data.publishedFor,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      type: "post",
    };
  }

  public static toProfileResponse(data: any): UserProfileResponseDto {
    return {
      userId: data.userId.toString(),
      username: data.username,
      firstname: data.firstname,
      lastname: data.lastname,
      fullname: `${data.firstname} ${data.lastname}`,
      imageUrl: data.imageUrl,
      posts: data.posts.map(
        (post: PostCompact): Omit<PostCompact, "tags"> => ({
          postId: post.postId,
          userId: post.userId,
          caption: post.caption,
          images: post.images,
          publishedFor: post.publishedFor,
          createdAt: post.createdAt,
          updatedAt: post.updatedAt,
        }),
      ),
      followersCount: data.followersCount,
      followingCount: data.followingCount,
      isFollowing: data.isFollowing,
    };
  }
}
