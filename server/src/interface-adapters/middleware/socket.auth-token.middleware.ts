import jwt from "jsonwebtoken";
import { HttpError } from "../errors/HttpError";
import { TokenPayloadType } from "../../types/tokens";
import { activeUsers } from "../websocket";
import container from "../../shared/inversify.config";
import { TYPES } from "../../shared/types";
import type { ExtendedError, Socket } from "socket.io";
import type { IFetchUser } from "../../domain/use-cases/IFetchUser";
import type { IGetConversations } from "../../domain/use-cases/IGetConversations";

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
      const fetchUserUseCase = container.get<IFetchUser>(TYPES.IFetchUser);
      const getConversationsUseCase = container.get<IGetConversations>(
        TYPES.IGetConversations,
      );

      var user = await fetchUserUseCase.execute(data.id, {
        allowNotVerified: true,
      });

      if (!user) throw new HttpError(401, "Unauthorized: Invalid user");
      if (user.isBlocked())
        throw new HttpError(401, "Unauthorized: User has been blocked");

      const conversations = await getConversationsUseCase.execute(user.getId());
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
