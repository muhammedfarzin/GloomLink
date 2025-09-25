import { Router } from "express";
import { authenticateToken } from "../../middleware/authenticate-token.middleware";
import { authorizeRole } from "../../middleware/authorize-role.middleware";
import { uploadImage } from "../../middleware/file-upload.middleware";
import * as profileController from "../../controllers/profile.controller";
import { followRouter } from "./follow.router";

const router = Router();

router.get(
  "/form",
  authenticateToken,
  authorizeRole("user"),
  profileController.fetchUserDataForForm
);

router.put(
  "/update",
  authenticateToken,
  authorizeRole("user"),
  uploadImage.single("image"),
  profileController.updateProfile
);

router.get(
  "/:username",
  authenticateToken,
  authorizeRole("user"),
  profileController.getUserProfile
);

router.use("/follow", followRouter);

export { router as profileRouter };
