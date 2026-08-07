import { catchAsync } from "../../utils/catchAsync.js";
import { sendResponse } from "../../utils/sendResponse.js";
import { certificationService } from "./certification.service.js";

const getAllCertification = catchAsync(async (req, res) => {
  const items = await certificationService.getAllCertification(req.query);
  sendResponse(res, { statusCode: 200, message: "Certification list retrieved", data: items });
});

const getCertificationById = catchAsync(async (req, res) => {
  const item = await certificationService.getCertificationById(req.params.id);
  sendResponse(res, { statusCode: 200, message: "Certification retrieved", data: item });
});

const createCertification = catchAsync(async (req, res) => {
  const item = await certificationService.createCertification(req.body);
  sendResponse(res, { statusCode: 201, message: "Certification created", data: item });
});

const updateCertification = catchAsync(async (req, res) => {
  const item = await certificationService.updateCertification(req.params.id, req.body);
  sendResponse(res, { statusCode: 200, message: "Certification updated", data: item });
});

const deleteCertification = catchAsync(async (req, res) => {
  const item = await certificationService.deleteCertification(req.params.id);
  sendResponse(res, { statusCode: 200, message: "Certification deleted", data: item });
});

export const certificationController = {
  getAllCertification,
  getCertificationById,
  createCertification,
  updateCertification,
  deleteCertification,
};

export default certificationController;
