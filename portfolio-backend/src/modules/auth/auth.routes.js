import { Router } from "express";
import { auth } from "../../middleware/auth.js";
import { authController } from "./auth.controller.js";

const router = Router();

router.post("/login", authController.login);
router.post("/refresh-token", authController.refreshToken);
router.post("/logout", authController.logout);
router.get("/me", auth(), authController.getMe);

  router.post("/firebase-login", authController.firebaseLogin);


export default router;
