import { Router } from "express";
import { auth } from "../../middleware/auth.js";
import { publicCache } from "../../middleware/publicCache.js";
import { projectController } from "./project.controller.js";

const router = Router();

router.get("/admin", auth(), projectController.getAllProjectForAdmin);
router.get("/", publicCache, projectController.getAllProject);
router.get("/:id", publicCache, projectController.getProjectById);
router.post("/", auth(), projectController.createProject);
router.patch("/:id", auth(), projectController.updateProject);
router.delete("/:id", auth(), projectController.deleteProject);

export default router;
