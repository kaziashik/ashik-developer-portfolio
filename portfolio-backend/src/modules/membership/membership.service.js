import { Membership } from "./membership.model.js";
import { AppError } from "../../utils/AppError.js";

const getAllMembership = async (query) => {
  const filter = {};
  if (query.visibility !== undefined) filter.visibility = query.visibility;
  return Membership.find(filter).sort({ startDate: -1 });
};

const getMembershipById = async (id) => {
  const item = await Membership.findById(id);
  if (!item) throw new AppError("Membership not found", 404);
  return item;
};

const createMembership = async (payload) => {
  return Membership.create(payload);
};

const updateMembership = async (id, payload) => {
  const item = await Membership.findByIdAndUpdate(id, payload, { new: true, runValidators: true });
  if (!item) throw new AppError("Membership not found", 404);
  return item;
};

const deleteMembership = async (id) => {
  const item = await Membership.findByIdAndDelete(id);
  if (!item) throw new AppError("Membership not found", 404);
  return item;
};

export const membershipService = {
  getAllMembership,
  getMembershipById,
  createMembership,
  updateMembership,
  deleteMembership,
};

export default membershipService;
