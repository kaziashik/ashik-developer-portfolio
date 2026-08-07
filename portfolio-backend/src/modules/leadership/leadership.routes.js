import { Router } from "express";
import { auth } from "../../middleware/auth.js";
import { leadershipController } from "./leadership.controller.js";

const router = Router();

router.get("/", leadershipController.getAllLeadership);
router.get("/:id", leadershipController.getLeadershipById);
router.post("/", auth(), leadershipController.createLeadership);
router.patch("/:id", auth(), leadershipController.updateLeadership);
router.delete("/:id", auth(), leadershipController.deleteLeadership);

export default router;
