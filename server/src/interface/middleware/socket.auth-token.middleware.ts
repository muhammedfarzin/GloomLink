import jwt, { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import { HttpError } from "../../infrastructure/errors/HttpError";
import { TokenPayloadType } from "../../application/services/token.service";
import { userRepository } from "../../infrastructure/repositories/UserRepository";
import type { ExtendedError, Socket } from "socket.io";
import { activeUsers } from "../websocket";

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
      var userData = await userRepository.findById(data._id);
      if (!userData) throw new Error("Unauthorized: Invalid user");
      if (userData.status === "blocked")
        throw new Error("Unauthorized: User has been blocked");

      const { authType = "email", _id: userId } = userData;

      socket.user = {
        role: "user",
        ...userData,
        _id: userId.toString(),
        authType,
      };

      if (!activeUsers[userData.username])
        activeUsers[userData.username] = new Set();

      activeUsers[userData.username].add(socket.id);
    } else socket.user = { ...data, _id: "admin" };

    next();
  } catch (error: any) {
    const message = error.message || "Something went wrong";
    const statusCode = error.statusCode || 500;

    socket.emit("error-auth", message, statusCode);
  }
};
