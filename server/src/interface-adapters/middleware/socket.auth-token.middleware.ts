import jwt from "jsonwebtoken";
import { HttpError } from "../../infrastructure/errors/HttpError";
import { TokenPayloadType } from "../../types/tokens";
import { UserRepository } from "../../infrastructure/repositories/UserRepository";
import type { ExtendedError, Socket } from "socket.io";
import { activeUsers } from "../websocket";
import { ConversationRepository } from "../../infrastructure/repositories/ConversationRepository";

export const authenticateTokenForSocket = async (
  socket: Socket,
  next: (err?: ExtendedError) => void
) => {
  const token = socket.handshake.auth.token;

  try {
    if (!token) {
      throw new HttpError(401, "Unauthorized: No token provided");
    }

    const data = jwt.verify(
      token,
      process.env.JWT_ACCESS_SECRET || "secret"
    ) as TokenPayloadType;

    if (data.role === "user") {
      const userRepository = new UserRepository();
      const conversationRepository = new ConversationRepository();

      var userData = await userRepository.findById(data.id);
      if (!userData) throw new Error("Unauthorized: Invalid user");
      if (userData.status === "blocked")
        throw new Error("Unauthorized: User has been blocked");

      const conversations =
        await conversationRepository.findConversationsByUserId(userData._id);
      socket.join(
        conversations.map((conversation) => conversation.conversationId)
      );

      const { authType = "email", _id: userId } = userData;

      socket.user = {
        role: "user",
        ...userData,
        id: userId.toString(),
        authType,
      };

      if (!activeUsers[userData.username])
        activeUsers[userData.username] = new Set();

      activeUsers[userData.username].add(socket.id);
    } else socket.user = { role: "admin", id: data.id, username: data.id };

    next();
  } catch (error: any) {
    const message = error.message || "Something went wrong";
    const statusCode = error.statusCode || 500;

    socket.emit("error-auth", message, statusCode);
  }
};
