import { AppError } from "./AppError";

export class NotFoundError extends AppError {
  constructor(message: string) {
    super(message, "NOT_FOUND");
  }
}

export class UserNotFoundError extends NotFoundError {
  constructor(message?: string) {
    super(message || "User not found");
  }
}

export class PostNotFoundError extends NotFoundError {
  constructor(message?: string) {
    super(message || "Post not found");
  }
}

export class CommentNotFoundError extends NotFoundError {
  constructor(message?: string) {
    super(message || "Comment not found");
  }
}

export class ConversationNotFoundError extends NotFoundError {
  constructor(message?: string) {
    super(message || "Conversation not found");
  }
}

export class MessageNotFoundError extends NotFoundError {
  constructor(message?: string) {
    super(message || "Message not found");
  }
}
