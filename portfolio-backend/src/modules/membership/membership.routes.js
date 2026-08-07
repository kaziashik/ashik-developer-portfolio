import { Router } from "express";
import { auth } from "../../middleware/auth.js";
import { membershipController } from "./membership.controller.js";

const router = Router();

router.get("/", membershipController.getAllMembership);
router.get("/:id", membershipController.getMembershipById);
router.post("/", auth(), membershipController.createMembership);
router.patch("/:id", auth(), membershipController.updateMembership);
router.delete("/:id", auth(), membershipController.deleteMembership);

export default router;
