import express, { type Express } from "express";
import http from "http";
import dotenv from "dotenv";
import cors from "cors";
import { connectDatabase } from "./infrastructure/database";
import router from "./interface/routes";
import { setupSocket } from "./interface/websocket";

dotenv.config();

const PORT = process.env.PORT || 5000;

const app: Express = express();
const server = http.createServer(app);

app.use(express.json());
app.use(cors());
app.use(express.static("public"));

app.use(router);

setupSocket(server);

server.listen(PORT, () => {
  connectDatabase();
  console.log("Server is running on port", PORT);
});
