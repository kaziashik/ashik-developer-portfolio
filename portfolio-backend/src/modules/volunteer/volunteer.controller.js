import { catchAsync } from "../../utils/catchAsync.js";
import { sendResponse } from "../../utils/sendResponse.js";
import { volunteerService } from "./volunteer.service.js";

const getAllVolunteer = catchAsync(async (req, res) => {
  const items = await volunteerService.getAllVolunteer(req.query);
  sendResponse(res, { statusCode: 200, message: "Volunteer list retrieved", data: items });
});

const getVolunteerById = catchAsync(async (req, res) => {
  const item = await volunteerService.getVolunteerById(req.params.id);
  sendResponse(res, { statusCode: 200, message: "Volunteer retrieved", data: item });
});

const createVolunteer = catchAsync(async (req, res) => {
  const item = await volunteerService.createVolunteer(req.body);
  sendResponse(res, { statusCode: 201, message: "Volunteer created", data: item });
});

const updateVolunteer = catchAsync(async (req, res) => {
  const item = await volunteerService.updateVolunteer(req.params.id, req.body);
  sendResponse(res, { statusCode: 200, message: "Volunteer updated", data: item });
});

const deleteVolunteer = catchAsync(async (req, res) => {
  const item = await volunteerService.deleteVolunteer(req.params.id);
  sendResponse(res, { statusCode: 200, message: "Volunteer deleted", data: item });
});

export const volunteerController = {
  getAllVolunteer,
  getVolunteerById,
  createVolunteer,
  updateVolunteer,
  deleteVolunteer,
};

export default volunteerController;
