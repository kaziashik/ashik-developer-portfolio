import { catchAsync } from "../../utils/catchAsync.js";
import { sendResponse } from "../../utils/sendResponse.js";
import { awardService } from "./award.service.js";

const getAllAward = catchAsync(async (req, res) => {
  const items = await awardService.getAllAward(req.query);
  sendResponse(res, { statusCode: 200, message: "Award list retrieved", data: items });
});

const getAwardById = catchAsync(async (req, res) => {
  const item = await awardService.getAwardById(req.params.id);
  sendResponse(res, { statusCode: 200, message: "Award retrieved", data: item });
});

const createAward = catchAsync(async (req, res) => {
  const item = await awardService.createAward(req.body);
  sendResponse(res, { statusCode: 201, message: "Award created", data: item });
});

const updateAward = catchAsync(async (req, res) => {
  const item = await awardService.updateAward(req.params.id, req.body);
  sendResponse(res, { statusCode: 200, message: "Award updated", data: item });
});

const deleteAward = catchAsync(async (req, res) => {
  const item = await awardService.deleteAward(req.params.id);
  sendResponse(res, { statusCode: 200, message: "Award deleted", data: item });
});

export const awardController = {
  getAllAward,
  getAwardById,
  createAward,
  updateAward,
  deleteAward,
};

export default awardController;
