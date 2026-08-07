import { catchAsync } from "../../utils/catchAsync.js";
import { sendResponse } from "../../utils/sendResponse.js";
import { leadershipService } from "./leadership.service.js";

const getAllLeadership = catchAsync(async (req, res) => {
  const items = await leadershipService.getAllLeadership(req.query);
  sendResponse(res, { statusCode: 200, message: "Leadership list retrieved", data: items });
});

const getLeadershipById = catchAsync(async (req, res) => {
  const item = await leadershipService.getLeadershipById(req.params.id);
  sendResponse(res, { statusCode: 200, message: "Leadership retrieved", data: item });
});

const createLeadership = catchAsync(async (req, res) => {
  const item = await leadershipService.createLeadership(req.body);
  sendResponse(res, { statusCode: 201, message: "Leadership created", data: item });
});

const updateLeadership = catchAsync(async (req, res) => {
  const item = await leadershipService.updateLeadership(req.params.id, req.body);
  sendResponse(res, { statusCode: 200, message: "Leadership updated", data: item });
});

const deleteLeadership = catchAsync(async (req, res) => {
  const item = await leadershipService.deleteLeadership(req.params.id);
  sendResponse(res, { statusCode: 200, message: "Leadership deleted", data: item });
});

export const leadershipController = {
  getAllLeadership,
  getLeadershipById,
  createLeadership,
  updateLeadership,
  deleteLeadership,
};

export default leadershipController;
