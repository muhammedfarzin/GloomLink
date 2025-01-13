import { PostModel, type Post } from "../database/models/PostModel";
import { UserModel } from "../database/models/UserModel";
import { HttpError } from "../errors/HttpError";
import { userRepository } from "./UserRepository";

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

  async getPosts(userId: string) {
    const user = await userRepository.findById(userId, { savedPosts: 1 });
    if (!user) throw new HttpError(401, "Unauthorized");
    const savedPosts = user.savedPosts.map((post) => post.toString());

    const posts = await PostModel.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "uploadedBy",
          pipeline: [
            {
              $project: {
                username: 1,
                image: 1,
                firstname: 1,
                lastname: 1,
              },
            },
          ],
        },
      },
      { $limit: 20 },
      { $unwind: "$uploadedBy" },
    ]);

    const resPosts = posts.map((post) => {
      post.saved = savedPosts.includes(post._id.toString());
      return post;
    });
    return resPosts;
  }

  async getSavedPost(userId: string) {
    const user = await UserModel.findOne({ _id: userId });
    if (!user) throw new HttpError(404, "User not found");

    const savedPosts = await PostModel.aggregate([
      { $match: { _id: { $in: user.savedPosts } } },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "uploadedBy",
          pipeline: [
            {
              $project: {
                username: 1,
                image: 1,
                firstname: 1,
                lastname: 1,
              },
            },
          ],
        },
      },
      { $limit: 20 },
      { $unwind: "$uploadedBy" },
      { $addFields: { saved: true } },
    ]);

    return savedPosts;
  }
}

export const postRepository = new PostRepository();
