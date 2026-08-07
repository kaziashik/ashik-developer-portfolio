import { catchAsync } from "../../utils/catchAsync.js";
import { sendResponse } from "../../utils/sendResponse.js";
import { publicationService } from "./publication.service.js";

const getAllPublication = catchAsync(async (req, res) => {
  const items = await publicationService.getAllPublication(req.query);
  sendResponse(res, { statusCode: 200, message: "Publication list retrieved", data: items });
});

const getPublicationById = catchAsync(async (req, res) => {
  const item = await publicationService.getPublicationById(req.params.id);
  sendResponse(res, { statusCode: 200, message: "Publication retrieved", data: item });
});

const createPublication = catchAsync(async (req, res) => {
  const item = await publicationService.createPublication(req.body);
  sendResponse(res, { statusCode: 201, message: "Publication created", data: item });
});

const updatePublication = catchAsync(async (req, res) => {
  const item = await publicationService.updatePublication(req.params.id, req.body);
  sendResponse(res, { statusCode: 200, message: "Publication updated", data: item });
});

const deletePublication = catchAsync(async (req, res) => {
  const item = await publicationService.deletePublication(req.params.id);
  sendResponse(res, { statusCode: 200, message: "Publication deleted", data: item });
});

export const publicationController = {
  getAllPublication,
  getPublicationById,
  createPublication,
  updatePublication,
  deletePublication,
};

export default publicationController;
