import { Router } from "express";
import { auth } from "../../middleware/auth.js";
import { publicCache } from "../../middleware/publicCache.js";
import { uploadResume } from "../../middleware/uploadResume.js";
import { profileController } from "./profile.controller.js";

const router = Router();

router.get("/", publicCache, profileController.getProfile);
// No publicCache here — resume updates must show immediately after admin upload.
router.get("/resume", profileController.getResume);
router.post("/resume", auth(), uploadResume, profileController.uploadResume);
router.put("/", auth(), profileController.updateProfile);

router.patch("/skills/:type/reorder", auth(), profileController.reorderSkills);
router.patch("/skills/:type/:skillId", auth(), profileController.updateSkillCategory);
router.delete("/skills/:type/:skillId", auth(), profileController.deleteSkillCategory);
router.patch("/skills/:type", auth(), profileController.addSkillCategory);

export default router;
