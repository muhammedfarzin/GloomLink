import { CompactUser } from "@/types/user";
import { Post } from "@/types/Post";

export type SearchResultType =
  | ({ type: "user" } & CompactUser)
  | ({ type: "post" } & Post);
