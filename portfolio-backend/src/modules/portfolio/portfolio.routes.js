import { Router } from "express";
import { auth } from "../../middleware/auth.js";
import { publicCache } from "../../middleware/publicCache.js";
import { portfolioController } from "./portfolio.controller.js";

const router = Router();

router.get("/admin", auth(), portfolioController.getAdminPortfolio);
router.get("/", publicCache, portfolioController.getPublicPortfolio);

export default router;
