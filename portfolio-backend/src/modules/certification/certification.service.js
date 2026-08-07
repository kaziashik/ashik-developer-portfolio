import { Certification } from "./certification.model.js";
import { AppError } from "../../utils/AppError.js";

const getAllCertification = async (query) => {
  const filter = {};
  if (query.visibility !== undefined) filter.visibility = query.visibility;
  return Certification.find(filter).sort({ date: -1 });
};

const getCertificationById = async (id) => {
  const item = await Certification.findById(id);
  if (!item) throw new AppError("Certification not found", 404);
  return item;
};

const createCertification = async (payload) => {
  return Certification.create(payload);
};

const updateCertification = async (id, payload) => {
  const item = await Certification.findByIdAndUpdate(id, payload, { new: true, runValidators: true });
  if (!item) throw new AppError("Certification not found", 404);
  return item;
};

const deleteCertification = async (id) => {
  const item = await Certification.findByIdAndDelete(id);
  if (!item) throw new AppError("Certification not found", 404);
  return item;
};

export const certificationService = {
  getAllCertification,
  getCertificationById,
  createCertification,
  updateCertification,
  deleteCertification,
};

export default certificationService;
