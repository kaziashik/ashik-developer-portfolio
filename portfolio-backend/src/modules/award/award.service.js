import { Award } from "./award.model.js";
import { AppError } from "../../utils/AppError.js";

const getAllAward = async (query) => {
  const filter = {};
  if (query.visibility !== undefined) filter.visibility = query.visibility;
  return Award.find(filter).sort({ year: -1 });
};

const getAwardById = async (id) => {
  const item = await Award.findById(id);
  if (!item) throw new AppError("Award not found", 404);
  return item;
};

const createAward = async (payload) => {
  return Award.create(payload);
};

const updateAward = async (id, payload) => {
  const item = await Award.findByIdAndUpdate(id, payload, { new: true, runValidators: true });
  if (!item) throw new AppError("Award not found", 404);
  return item;
};

const deleteAward = async (id) => {
  const item = await Award.findByIdAndDelete(id);
  if (!item) throw new AppError("Award not found", 404);
  return item;
};

export const awardService = {
  getAllAward,
  getAwardById,
  createAward,
  updateAward,
  deleteAward,
};

export default awardService;
