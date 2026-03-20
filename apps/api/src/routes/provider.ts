import { Router } from "express";

import { providerController } from "../controllers/providerController";
import { asyncHandler } from "../middleware/errorHandler";

const router = Router();
router.get("/", asyncHandler(providerController));

export default router;
