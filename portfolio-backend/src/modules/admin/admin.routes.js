import { Router } from "express";
import { auth } from "../../middleware/auth.js";
import { adminController } from "./admin.controller.js";

const router = Router();

router.get("/me", auth(), adminController.getMe);
router.patch("/change-password", auth(), adminController.changePassword);

export default router;
