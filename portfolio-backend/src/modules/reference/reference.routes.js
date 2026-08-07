import { Router } from "express";
import { auth } from "../../middleware/auth.js";
import { referenceController } from "./reference.controller.js";

const router = Router();

router.get("/", auth(), referenceController.getAllReference);
router.get("/:id", auth(), referenceController.getReferenceById);
router.post("/", auth(), referenceController.createReference);
router.patch("/:id", auth(), referenceController.updateReference);
router.delete("/:id", auth(), referenceController.deleteReference);

export default router;
