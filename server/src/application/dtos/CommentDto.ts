export interface CommentResponseDto {
  readonly id: string;
  readonly targetId: string;
  readonly userId: string;
  comment: string;
  readonly type: "post" | "comment";
  readonly createdAt: Date;
  updatedAt: Date;
}
