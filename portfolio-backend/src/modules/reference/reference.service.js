import { Reference } from "./reference.model.js";
import { AppError } from "../../utils/AppError.js";

const getAllReference = async (query) => {
  const filter = {};
  if (query.visibility !== undefined) filter.visibility = query.visibility;
  return Reference.find(filter).sort({ createdAt: -1 });
};

const getReferenceById = async (id) => {
  const item = await Reference.findById(id);
  if (!item) throw new AppError("Reference not found", 404);
  return item;
};

const createReference = async (payload) => {
  return Reference.create(payload);
};

const updateReference = async (id, payload) => {
  const item = await Reference.findByIdAndUpdate(id, payload, { new: true, runValidators: true });
  if (!item) throw new AppError("Reference not found", 404);
  return item;
};

const deleteReference = async (id) => {
  const item = await Reference.findByIdAndDelete(id);
  if (!item) throw new AppError("Reference not found", 404);
  return item;
};

export const referenceService = {
  getAllReference,
  getReferenceById,
  createReference,
  updateReference,
  deleteReference,
};

export default referenceService;
