import { PostModel, type Post } from "../database/models/PostModel";
import { HttpError } from "../errors/HttpError";

class PostRepository {
  async createPost(
    postData: Omit<Post, "_id" | "status" | "userId"> & { userId: string }
  ) {
    const { caption, images, publishedFor, tags, userId } = postData;

    if (
      !publishedFor ||
      (publishedFor !== "public" && publishedFor !== "subscriber")
    ) {
      throw new HttpError(400, "Please provide valid publishedFor");
    }

    const newPost = new PostModel({
      caption,
      images,
      publishedFor,
      tags,
      userId,
    });

    const post = await newPost.save();
    return post.toObject();
  }
}

export const postRepository = new PostRepository();
