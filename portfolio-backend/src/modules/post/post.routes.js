import { Router } from "express";
import { auth } from "../../middleware/auth.js";
import { postController } from "./post.controller.js";

const router = Router();

router.get("/", postController.getAllPost);
router.get("/:id", postController.getPostById);
router.post("/", auth(), postController.createPost);
router.patch("/:id", auth(), postController.updatePost);
router.delete("/:id", auth(), postController.deletePost);

export default router;
