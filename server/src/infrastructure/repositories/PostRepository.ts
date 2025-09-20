import { IPostRepository } from "../../domain/repositories/IPostRepository";
import { Post } from "../../domain/entities/Post";
import { PostMapper } from "../database/mappers/PostMapper";
import { PostModel } from "../database/models/PostModel";

export class PostRepository implements IPostRepository {
  async create(postData: Partial<Post>): Promise<Post> {
    const postToPersist = PostMapper.toPersistence(postData);
    const newPostModel = new PostModel(postToPersist);
    const savedPost = await newPostModel.save();
    return PostMapper.toDomain(savedPost);
  }

  async findById(id: string): Promise<Post | null> {
    const postModel = await PostModel.findById(id);
    return postModel ? PostMapper.toDomain(postModel) : null;
  }
}
