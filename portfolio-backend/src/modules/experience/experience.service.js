import { Experience } from "./experience.model.js";
import { AppError } from "../../utils/AppError.js";

const getAllExperience = async (query) => {
 const filter = { isPublic: { $ne: false } };
  if (query.visibility !== undefined) filter.visibility = query.visibility;
  if (query.category !== undefined) filter.category = query.category;
  return Experience.find(filter).sort({ startDate: -1 }).lean();
};

const getExperienceById = async (id) => {
  const item = await Experience.findById(id).lean();
  if (!item) throw new AppError("Experience not found", 404);
  return item;
};

const createExperience = async (payload) => {
  return Experience.create(payload);
};

const updateExperience = async (id, payload) => {
  const item = await Experience.findByIdAndUpdate(id, payload, { new: true, runValidators: true });
  if (!item) throw new AppError("Experience not found", 404);
  return item;
};

const deleteExperience = async (id) => {
  const item = await Experience.findByIdAndDelete(id);
  if (!item) throw new AppError("Experience not found", 404);
  return item;
};

const getAllExperienceForAdmin = async (query) => {
  const filter = {};
  if (query.visibility !== undefined) filter.visibility = query.visibility;
  if (query.category !== undefined) filter.category = query.category;
  return Experience.find(filter).sort({ startDate: -1 }).lean();
};

export const experienceService = {
  getAllExperience,
  getExperienceById,
  createExperience,
  updateExperience,
  deleteExperience,
  getAllExperienceForAdmin
};

export default experienceService;
