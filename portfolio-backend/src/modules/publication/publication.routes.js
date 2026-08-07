import { Router } from "express";
import { auth } from "../../middleware/auth.js";
import { publicationController } from "./publication.controller.js";

const router = Router();

router.get("/", publicationController.getAllPublication);
router.get("/:id", publicationController.getPublicationById);
router.post("/", auth(), publicationController.createPublication);
router.patch("/:id", auth(), publicationController.updatePublication);
router.delete("/:id", auth(), publicationController.deletePublication);

export default router;
