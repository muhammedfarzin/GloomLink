import jwt from "jsonwebtoken";
import { HttpError } from "../../infrastructure/errors/HttpError";
import { TokenPayloadType } from "../../types/tokens";
import { UserRepository } from "../../infrastructure/repositories/UserRepository";
import type { ExtendedError, Socket } from "socket.io";
import { activeUsers } from "../websocket";
import { ConversationRepository } from "../../infrastructure/repositories/ConversationRepository";

export const authenticateTokenForSocket = async (
  socket: Socket,
  next: (err?: ExtendedError) => void,
) => {
  const token = socket.handshake.auth.token;

  try {
    if (!token) {
      throw new HttpError(401, "Unauthorized: No token provided");
    }

    const data = jwt.verify(
      token,
      process.env.JWT_ACCESS_SECRET || "secret",
    ) as TokenPayloadType;

    if (data.role === "user") {
      const userRepository = new UserRepository();
      const conversationRepository = new ConversationRepository();

      var user = await userRepository.findById(data.id);
      if (!user) throw new Error("Unauthorized: Invalid user");
      if (user.isBlocked())
        throw new Error("Unauthorized: User has been blocked");

      const conversations =
        await conversationRepository.findConversationsByUserId(user.getId());
      socket.join(
        conversations.map((conversation) => conversation.conversationId),
      );

      const username = user.getUsername();
      socket.user = {
        role: "user",
        id: user.getId(),
        username,
        firstname: user.getFirstName(),
        lastname: user.getLastName(),
        email: user.getEmail(),
        status: user.getStatus(),
        authType: user.getAuthType(),
      };

      if (!activeUsers[username]) {
        activeUsers[username] = new Set();
      }

      activeUsers[username].add(socket.id);
    } else socket.user = { role: "admin", id: data.id, username: data.id };

    next();
  } catch (error: any) {
    const message = error.message || "Something went wrong";
    const statusCode = error.statusCode || 500;

    socket.emit("error-auth", message, statusCode);
  }
};
