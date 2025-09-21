import { Types } from "mongoose";
import { Post } from "../../../domain/entities/Post";
import { PostDocument } from "../models/PostModel";
import { EnrichedPost } from "../../../domain/repositories/IPostRepository";

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
      uploadedBy: {
        _id: data.uploadedBy?._id?.toString(),
        firstname: data.uploadedBy?.firstname,
        lastname: data.uploadedBy?.lastname,
        username: data.uploadedBy?.username,
        image: data.uploadedBy?.image,
      },
    };
  }
}
