import { Router } from "express";
import { auth } from "../../middleware/auth.js";
import { publicCache } from "../../middleware/publicCache.js";
import { educationController } from "./education.controller.js";

const router = Router();
router.get("/admin", auth(), educationController.getAllEducationForAdmin);
router.get("/", publicCache, educationController.getAllEducation);
router.get("/:id", publicCache, educationController.getEducationById);
router.post("/", auth(), educationController.createEducation);
router.patch("/:id", auth(), educationController.updateEducation);
router.delete("/:id", auth(), educationController.deleteEducation);

export default router;
