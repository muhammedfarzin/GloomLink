import apiClient from "@/apiClient";
import { createContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import CallProvider from "./CallContext";

interface SocketProviderProps {
  children: React.ReactNode;
}

export const SocketContext = createContext<Socket | null>(null);
const SERVER_HOST = import.meta.env.VITE_API_BASE_URL as string;

const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      try {
        const socket = io(SERVER_HOST, { auth: { token }, reconnection: true });

        socket.on("connect_error", async (err) => {
          if (err.message === "token error") {
            await apiClient.get("/profile");
            const token = localStorage.getItem("accessToken");
            socket.auth = { token };
            socket.connect();
          }
        });

        setSocket(socket);

        return () => {
          socket.disconnect();
        };
      } catch (error) {
        console.log(error);
      }
    }
  }, []);

  return (
    <SocketContext.Provider value={socket}>
      <CallProvider>{children}</CallProvider>
    </SocketContext.Provider>
  );
};

export default SocketProvider;
