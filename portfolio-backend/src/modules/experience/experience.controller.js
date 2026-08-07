import { catchAsync } from "../../utils/catchAsync.js";
import { sendResponse } from "../../utils/sendResponse.js";
import { experienceService } from "./experience.service.js";

const getAllExperience = catchAsync(async (req, res) => {
  const items = await experienceService.getAllExperience(req.query);
  sendResponse(res, { statusCode: 200, message: "Experience list retrieved", data: items });
});

const getExperienceById = catchAsync(async (req, res) => {
  const item = await experienceService.getExperienceById(req.params.id);
  sendResponse(res, { statusCode: 200, message: "Experience retrieved", data: item });
});

const createExperience = catchAsync(async (req, res) => {
  const item = await experienceService.createExperience(req.body);
  sendResponse(res, { statusCode: 201, message: "Experience created", data: item });
});

const updateExperience = catchAsync(async (req, res) => {
  const item = await experienceService.updateExperience(req.params.id, req.body);
  sendResponse(res, { statusCode: 200, message: "Experience updated", data: item });
});

const deleteExperience = catchAsync(async (req, res) => {
  const item = await experienceService.deleteExperience(req.params.id);
  sendResponse(res, { statusCode: 200, message: "Experience deleted", data: item });
});

const getAllExperienceForAdmin = catchAsync(async (req, res) => {
  const items = await experienceService.getAllExperienceForAdmin(req.query);
  sendResponse(res, { statusCode: 200, message: "All experience retrieved", data: items });
});

export const experienceController = {
  getAllExperience,
  getExperienceById,
  createExperience,
  updateExperience,
  deleteExperience,
  getAllExperienceForAdmin
};

export default experienceController;
