import { Router } from "express";
import { auth } from "../../middleware/auth.js";
import { certificationController } from "./certification.controller.js";

const router = Router();

router.get("/", certificationController.getAllCertification);
router.get("/:id", certificationController.getCertificationById);
router.post("/", auth(), certificationController.createCertification);
router.patch("/:id", auth(), certificationController.updateCertification);
router.delete("/:id", auth(), certificationController.deleteCertification);

export default router;
