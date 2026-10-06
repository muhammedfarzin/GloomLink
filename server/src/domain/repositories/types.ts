export type SortOrder = "asc" | "desc";

export interface SortOptions {
  field: string;
  order: SortOrder;
}

export interface PaginationOptions {
  page?: number;
  limit?: number;
  skip?: number;
}

export interface BaseFindOptions extends PaginationOptions {
  searchQuery?: string;
  sort?: SortOptions | string;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
