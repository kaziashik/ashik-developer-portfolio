import { Router } from "express";
import { auth } from "../../middleware/auth.js";
import { awardController } from "./award.controller.js";

const router = Router();

router.get("/", awardController.getAllAward);
router.get("/:id", awardController.getAwardById);
router.post("/", auth(), awardController.createAward);
router.patch("/:id", auth(), awardController.updateAward);
router.delete("/:id", auth(), awardController.deleteAward);

export default router;
