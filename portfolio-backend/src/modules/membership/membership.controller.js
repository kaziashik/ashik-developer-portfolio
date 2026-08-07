import { catchAsync } from "../../utils/catchAsync.js";
import { sendResponse } from "../../utils/sendResponse.js";
import { membershipService } from "./membership.service.js";

const getAllMembership = catchAsync(async (req, res) => {
  const items = await membershipService.getAllMembership(req.query);
  sendResponse(res, { statusCode: 200, message: "Membership list retrieved", data: items });
});

const getMembershipById = catchAsync(async (req, res) => {
  const item = await membershipService.getMembershipById(req.params.id);
  sendResponse(res, { statusCode: 200, message: "Membership retrieved", data: item });
});

const createMembership = catchAsync(async (req, res) => {
  const item = await membershipService.createMembership(req.body);
  sendResponse(res, { statusCode: 201, message: "Membership created", data: item });
});

const updateMembership = catchAsync(async (req, res) => {
  const item = await membershipService.updateMembership(req.params.id, req.body);
  sendResponse(res, { statusCode: 200, message: "Membership updated", data: item });
});

const deleteMembership = catchAsync(async (req, res) => {
  const item = await membershipService.deleteMembership(req.params.id);
  sendResponse(res, { statusCode: 200, message: "Membership deleted", data: item });
});

export const membershipController = {
  getAllMembership,
  getMembershipById,
  createMembership,
  updateMembership,
  deleteMembership,
};

export default membershipController;
