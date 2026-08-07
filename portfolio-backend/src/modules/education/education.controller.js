import { catchAsync } from "../../utils/catchAsync.js";
import { sendResponse } from "../../utils/sendResponse.js";
import { educationService } from "./education.service.js";

const getAllEducation = catchAsync(async (req, res) => {
  const items = await educationService.getAllEducation(req.query);
  sendResponse(res, { statusCode: 200, message: "Education list retrieved", data: items });
});

const getEducationById = catchAsync(async (req, res) => {
  const item = await educationService.getEducationById(req.params.id);
  sendResponse(res, { statusCode: 200, message: "Education retrieved", data: item });
});

const createEducation = catchAsync(async (req, res) => {
  const item = await educationService.createEducation(req.body);
  sendResponse(res, { statusCode: 201, message: "Education created", data: item });
});

const updateEducation = catchAsync(async (req, res) => {
  const item = await educationService.updateEducation(req.params.id, req.body);
  sendResponse(res, { statusCode: 200, message: "Education updated", data: item });
});

const deleteEducation = catchAsync(async (req, res) => {
  const item = await educationService.deleteEducation(req.params.id);
  sendResponse(res, { statusCode: 200, message: "Education deleted", data: item });
});

const getAllEducationForAdmin = catchAsync(async (req, res) => {
  const items = await educationService.getAllEducationForAdmin(req.query);
  sendResponse(res, { statusCode: 200, message: "All education retrieved", data: items });
});

export const educationController = {
  getAllEducation,
  getEducationById,
  createEducation,
  updateEducation,
  deleteEducation,
  getAllEducationForAdmin
};

export default educationController;
