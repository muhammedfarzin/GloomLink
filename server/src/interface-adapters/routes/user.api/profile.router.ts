import { Router } from "express";
import { authenticateToken } from "../../middleware/authenticate-token.middleware";
import { authorizeRole } from "../../middleware/authorize-role.middleware";
import { uploadImage } from "../../middleware/file-upload.middleware";
import { followRouter } from "./follow.router";
import container from "../../../shared/inversify.config";
import { TYPES } from "../../../shared/types";

import type { ProfileController } from "../../controllers/profile.controller";

const router = Router();
const profileController = container.get<ProfileController>(
  TYPES.ProfileController,
);

router.get(
  "/form",
  authenticateToken,
  authorizeRole("user"),
  profileController.fetchUserDataForForm,
);

router.put(
  "/update",
  authenticateToken,
  authorizeRole("user"),
  uploadImage.single("image"),
  profileController.updateProfile,
);

router.get(
  "/:username",
  authenticateToken,
  authorizeRole("user"),
  profileController.getUserProfile,
);

router.use("/follow", followRouter);

export { router as profileRouter };
