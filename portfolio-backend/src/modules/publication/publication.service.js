import { Publication } from "./publication.model.js";
import { AppError } from "../../utils/AppError.js";

const getAllPublication = async (query) => {
  const filter = {};
  if (query.visibility !== undefined) filter.visibility = query.visibility;
  if (query.type !== undefined) filter.type = query.type;
  if (query.status !== undefined) filter.status = query.status;
  return Publication.find(filter).sort({ publicationDate: -1 });
};

const getPublicationById = async (id) => {
  const item = await Publication.findById(id);
  if (!item) throw new AppError("Publication not found", 404);
  return item;
};

const createPublication = async (payload) => {
  return Publication.create(payload);
};

const updatePublication = async (id, payload) => {
  const item = await Publication.findByIdAndUpdate(id, payload, { new: true, runValidators: true });
  if (!item) throw new AppError("Publication not found", 404);
  return item;
};

const deletePublication = async (id) => {
  const item = await Publication.findByIdAndDelete(id);
  if (!item) throw new AppError("Publication not found", 404);
  return item;
};

export const publicationService = {
  getAllPublication,
  getPublicationById,
  createPublication,
  updatePublication,
  deletePublication,
};

export default publicationService;
