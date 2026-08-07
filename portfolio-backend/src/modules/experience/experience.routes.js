import { Router } from "express";
import { auth } from "../../middleware/auth.js";
import { publicCache } from "../../middleware/publicCache.js";
import { experienceController } from "./experience.controller.js";

const router = Router();
router.get("/admin", auth(), experienceController.getAllExperienceForAdmin);
router.get("/", publicCache, experienceController.getAllExperience);
router.get("/:id", publicCache, experienceController.getExperienceById);
router.post("/", auth(), experienceController.createExperience);
router.patch("/:id", auth(), experienceController.updateExperience);
router.delete("/:id", auth(), experienceController.deleteExperience);

export default router;
