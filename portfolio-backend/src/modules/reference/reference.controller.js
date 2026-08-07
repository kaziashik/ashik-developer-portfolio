import { catchAsync } from "../../utils/catchAsync.js";
import { sendResponse } from "../../utils/sendResponse.js";
import { referenceService } from "./reference.service.js";

const getAllReference = catchAsync(async (req, res) => {
  const items = await referenceService.getAllReference(req.query);
  sendResponse(res, { statusCode: 200, message: "Reference list retrieved", data: items });
});

const getReferenceById = catchAsync(async (req, res) => {
  const item = await referenceService.getReferenceById(req.params.id);
  sendResponse(res, { statusCode: 200, message: "Reference retrieved", data: item });
});

const createReference = catchAsync(async (req, res) => {
  const item = await referenceService.createReference(req.body);
  sendResponse(res, { statusCode: 201, message: "Reference created", data: item });
});

const updateReference = catchAsync(async (req, res) => {
  const item = await referenceService.updateReference(req.params.id, req.body);
  sendResponse(res, { statusCode: 200, message: "Reference updated", data: item });
});

const deleteReference = catchAsync(async (req, res) => {
  const item = await referenceService.deleteReference(req.params.id);
  sendResponse(res, { statusCode: 200, message: "Reference deleted", data: item });
});

export const referenceController = {
  getAllReference,
  getReferenceById,
  createReference,
  updateReference,
  deleteReference,
};

export default referenceController;
