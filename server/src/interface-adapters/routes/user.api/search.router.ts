import { Router } from "express";
import { authenticateToken } from "../../middleware/authenticate-token.middleware";
import { authorizeRole } from "../../middleware/authorize-role.middleware";
import container from "../../../shared/inversify.config";
import { TYPES } from "../../../shared/types";
import { SearchController } from "../../controllers/search.controller";

const router = Router();
const searchController = container.get<SearchController>(
  TYPES.SearchController,
);

router.get(
  "/",
  authenticateToken,
  authorizeRole("user"),
  searchController.search,
);

export { router as searchRouter };
