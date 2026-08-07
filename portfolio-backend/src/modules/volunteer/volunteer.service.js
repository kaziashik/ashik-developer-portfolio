import { Volunteer } from "./volunteer.model.js";
import { AppError } from "../../utils/AppError.js";

const getAllVolunteer = async (query) => {
  const filter = {};
  if (query.visibility !== undefined) filter.visibility = query.visibility;
  return Volunteer.find(filter).sort({ startDate: -1 });
};

const getVolunteerById = async (id) => {
  const item = await Volunteer.findById(id);
  if (!item) throw new AppError("Volunteer not found", 404);
  return item;
};

const createVolunteer = async (payload) => {
  return Volunteer.create(payload);
};

const updateVolunteer = async (id, payload) => {
  const item = await Volunteer.findByIdAndUpdate(id, payload, { new: true, runValidators: true });
  if (!item) throw new AppError("Volunteer not found", 404);
  return item;
};

const deleteVolunteer = async (id) => {
  const item = await Volunteer.findByIdAndDelete(id);
  if (!item) throw new AppError("Volunteer not found", 404);
  return item;
};

export const volunteerService = {
  getAllVolunteer,
  getVolunteerById,
  createVolunteer,
  updateVolunteer,
  deleteVolunteer,
};

export default volunteerService;
