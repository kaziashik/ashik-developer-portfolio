import { Project } from "./project.model.js";
import { AppError } from "../../utils/AppError.js";

const getAllProject = async (query) => {
    const filter = { isPublic: { $ne: false } }; // visitors never see hidden projects
  if (query.visibility !== undefined) filter.visibility = query.visibility;
  if (query.featured !== undefined) filter.featured = query.featured === "true";
  return Project.find(filter).sort({ startDate: -1 }).lean();
};

const getProjectById = async (id) => {
  const item = await Project.findById(id).lean();
  if (!item) throw new AppError("Project not found", 404);
  return item;
};

const createProject = async (payload) => {
  return Project.create(payload);
};

const updateProject = async (id, payload) => {
  const item = await Project.findByIdAndUpdate(id, payload, { new: true, runValidators: true });
  if (!item) throw new AppError("Project not found", 404);
  return item;
};

const deleteProject = async (id) => {
  const item = await Project.findByIdAndDelete(id);
  if (!item) throw new AppError("Project not found", 404);
  return item;
};

const getAllProjectForAdmin = async (query) => {
  const filter = {}; // admin sees everything, hidden or not
  if (query.visibility !== undefined) filter.visibility = query.visibility;
  if (query.featured !== undefined) filter.featured = query.featured === "true";
  return Project.find(filter).sort({ startDate: -1 }).lean();
};

export const projectService = {
  getAllProject,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  getAllProjectForAdmin
};

export default projectService;
