import "reflect-metadata";
import express, { type Express } from "express";
import http from "http";
import cors from "cors";
import dns from "dns";
import { connectDatabase } from "./infrastructure/database";
import { setupSocket } from "./interface-adapters/websocket";
import "dotenv/config";

dns.setServers(["8.8.8.8", "1.1.1.1"]);

const PORT = process.env.PORT || 5000;

const app: Express = express();
const server = http.createServer(app);

setupSocket(server);

app.use(express.json());
app.use(cors());

import("./interface-adapters/routes").then(({ default: router }) => {
  app.use(router);
});

server.listen(PORT, async () => {
  await connectDatabase();
  console.log("Server is running on port", PORT);
});
