import { Leadership } from "./leadership.model.js";
import { AppError } from "../../utils/AppError.js";

const getAllLeadership = async (query) => {
  const filter = {};
  if (query.visibility !== undefined) filter.visibility = query.visibility;
  return Leadership.find(filter).sort({ startDate: -1 });
};

const getLeadershipById = async (id) => {
  const item = await Leadership.findById(id);
  if (!item) throw new AppError("Leadership not found", 404);
  return item;
};

const createLeadership = async (payload) => {
  return Leadership.create(payload);
};

const updateLeadership = async (id, payload) => {
  const item = await Leadership.findByIdAndUpdate(id, payload, { new: true, runValidators: true });
  if (!item) throw new AppError("Leadership not found", 404);
  return item;
};

const deleteLeadership = async (id) => {
  const item = await Leadership.findByIdAndDelete(id);
  if (!item) throw new AppError("Leadership not found", 404);
  return item;
};

export const leadershipService = {
  getAllLeadership,
  getLeadershipById,
  createLeadership,
  updateLeadership,
  deleteLeadership,
};

export default leadershipService;
