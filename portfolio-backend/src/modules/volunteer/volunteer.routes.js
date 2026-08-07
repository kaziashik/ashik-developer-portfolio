import { Router } from "express";
import { auth } from "../../middleware/auth.js";
import { volunteerController } from "./volunteer.controller.js";

const router = Router();

router.get("/", volunteerController.getAllVolunteer);
router.get("/:id", volunteerController.getVolunteerById);
router.post("/", auth(), volunteerController.createVolunteer);
router.patch("/:id", auth(), volunteerController.updateVolunteer);
router.delete("/:id", auth(), volunteerController.deleteVolunteer);

export default router;
