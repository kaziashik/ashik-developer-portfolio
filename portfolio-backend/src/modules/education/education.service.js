import { Education } from "./education.model.js";
import { AppError } from "../../utils/AppError.js";

const getAllEducation = async (query) => {
 const filter = { isPublic: { $ne: false } };
  if (query.visibility !== undefined) filter.visibility = query.visibility;
  return Education.find(filter).sort({ startDate: -1 }).lean();
};

const getEducationById = async (id) => {
  const item = await Education.findById(id).lean();
  if (!item) throw new AppError("Education not found", 404);
  return item;
};

const createEducation = async (payload) => {
  return Education.create(payload);
};

const updateEducation = async (id, payload) => {
  const item = await Education.findByIdAndUpdate(id, payload, { new: true, runValidators: true });
  if (!item) throw new AppError("Education not found", 404);
  return item;
};

const deleteEducation = async (id) => {
  const item = await Education.findByIdAndDelete(id);
  if (!item) throw new AppError("Education not found", 404);
  return item;
};

const getAllEducationForAdmin = async (query) => {
  const filter = {};
  if (query.visibility !== undefined) filter.visibility = query.visibility;
  return Education.find(filter).sort({ startDate: -1 }).lean();
};

export const educationService = {
  getAllEducation,
  getEducationById,
  createEducation,
  updateEducation,
  deleteEducation,
  getAllEducationForAdmin
};

export default educationService;
