import { catchAsync } from "../../utils/catchAsync.js";
import { sendResponse } from "../../utils/sendResponse.js";
import { projectService } from "./project.service.js";

const getAllProject = catchAsync(async (req, res) => {
  const items = await projectService.getAllProject(req.query);
  sendResponse(res, { statusCode: 200, message: "Project list retrieved", data: items });
});

const getProjectById = catchAsync(async (req, res) => {
  const item = await projectService.getProjectById(req.params.id);
  sendResponse(res, { statusCode: 200, message: "Project retrieved", data: item });
});

const createProject = catchAsync(async (req, res) => {
  const item = await projectService.createProject(req.body);
  sendResponse(res, { statusCode: 201, message: "Project created", data: item });
});

const updateProject = catchAsync(async (req, res) => {
  const item = await projectService.updateProject(req.params.id, req.body);
  sendResponse(res, { statusCode: 200, message: "Project updated", data: item });
});

const deleteProject = catchAsync(async (req, res) => {
  const item = await projectService.deleteProject(req.params.id);
  sendResponse(res, { statusCode: 200, message: "Project deleted", data: item });
});

const getAllProjectForAdmin = catchAsync(async (req, res) => {
  const items = await projectService.getAllProjectForAdmin(req.query);
  sendResponse(res, { statusCode: 200, message: "All projects retrieved", data: items });
});

export const projectController = {
  getAllProject,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  getAllProjectForAdmin
};

export default projectController;
