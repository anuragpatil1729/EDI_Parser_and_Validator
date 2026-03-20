import { Router } from "express";
import multer from "multer";
import { uploadController } from "../controllers/uploadController";
import { uploadMetaController } from "../controllers/uploadMetaController";
import { asyncHandler } from "../middleware/errorHandler";

const router = Router();
const upload = multer();

router.post("/", upload.single("file"), uploadController);
router.get("/:fileId", asyncHandler(uploadMetaController));

export default router;
