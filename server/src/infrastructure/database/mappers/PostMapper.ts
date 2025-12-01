import { Types } from "mongoose";
import { Post } from "../../../domain/entities/Post";
import { PostDocument } from "../models/PostModel";
import { EnrichedPost } from "../../../domain/repositories/IPostRepository";
import { UserProfileResponseDto } from "../../../application/dtos/UserProfileResponseDto";

export class PostMapper {
  public static toDomain(postModel: PostDocument): Post {
    const postObject = postModel.toObject<PostDocument>?.() || postModel;

    return {
      ...postObject,
      _id: postObject._id.toString(),
      userId: postObject.userId.toString(),
    };
  }

  public static toPersistence(post: Partial<Post>): any {
    const persistencePost: any = { ...post };

    if (post._id) {
      persistencePost._id = new Types.ObjectId(post._id);
    }
    if (post.userId) {
      persistencePost.userId = new Types.ObjectId(post.userId);
    }

    return persistencePost;
  }

  public static toResponse(data: any): EnrichedPost {
    return {
      _id: data._id?.toString(),
      userId: data.userId?.toString(),
      images: data.images,
      caption: data.caption,
      tags: data.tags,
      status: data.status,
      isLiked: data.isLiked,
      isSaved: data.isSaved,
      commentsCount: data.commentsCount,
      likesCount: data.likesCount,
      publishedFor: data.publishedFor,
      reportCount: data.reportCount,
      uploadedBy: {
        _id: data.uploadedBy?._id?.toString(),
        firstname: data.uploadedBy?.firstname,
        lastname: data.uploadedBy?.lastname,
        username: data.uploadedBy?.username,
        image: data.uploadedBy?.image,
      },
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      type: "post",
    };
  }

  public static toProfileResponse(data: any): UserProfileResponseDto {
    return {
      _id: data._id.toString(),
      username: data.username,
      firstname: data.firstname,
      lastname: data.lastname,
      fullname: `${data.firstname} ${data.lastname}`,
      image: data.image,
      posts: data.posts.map((post: Post) => ({
        _id: post._id,
        userId: post.userId,
        caption: post.caption,
        images: post.images,
        publishedFor: post.publishedFor,
        status: post.status,
      })),
      followersCount: data.followersCount,
      followingCount: data.followingCount,
      isFollowing: data.isFollowing,
    };
  }
}
