import { Types } from "mongoose";
import { Post } from "../../../domain/entities/Post";
import { PostDocument } from "../models/PostModel";

export class PostMapper {
  public static toDomain(postModel: PostDocument): Post {
    const postObject = postModel.toObject<PostDocument>();

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
}
