import {
  IPostRepository,
  EnrichedPost,
} from "../../domain/repositories/IPostRepository";

export interface GetPostsByStatusInput {
  status: "active" | "blocked";
  page: number;
  limit: number;
  searchQuery?: string;
  withReports?: boolean;
}

export class GetPostsByStatus {
  constructor(private postRepository: IPostRepository) {}

  async execute(input: GetPostsByStatusInput): Promise<EnrichedPost[]> {
    const { status, ...restInput } = input;
    return this.postRepository.findByStatus(status, restInput);
  }
}
