import { Router } from "express";

import { dashboardController } from "../controllers/dashboardController";
import { asyncHandler } from "../middleware/errorHandler";

const router = Router();
router.get("/:type", asyncHandler(dashboardController));

export default router;
