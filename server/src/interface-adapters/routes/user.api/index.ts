import { Router } from "express";
import { profileRouter } from "./profile.router.js";
import { postsRouter } from "./posts.router.js";
import { commentsRouter } from "./comments.router.js";
import { conversationRouter } from "./conversation.router.js";
import { likesRouter } from "./likes.router.js";
import { searchRouter } from "./search.router.js";
import { reportRouter } from "./report.router.js";

const router = Router();

router.use("/search", searchRouter);
router.use("/profile", profileRouter);
router.use("/posts", postsRouter);
router.use("/likes", likesRouter);
router.use("/comments", commentsRouter);
router.use("/conversations", conversationRouter);
router.use("/report", reportRouter);

export { router as userApiRouter };
