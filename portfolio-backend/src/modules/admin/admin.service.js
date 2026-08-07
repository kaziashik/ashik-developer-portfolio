import { Admin } from "./admin.model.js";
import { AppError } from "../../utils/AppError.js";

const getAdminById = async (id) => {
  const admin = await Admin.findById(id);
  if (!admin) throw new AppError("Admin not found", 404);
  return admin;
};

const changePassword = async (id, currentPassword, newPassword) => {
  const admin = await Admin.findById(id).select("+password");
  if (!admin) throw new AppError("Admin not found", 404);

  const matches = await admin.comparePassword(currentPassword);
  if (!matches) throw new AppError("Current password is incorrect", 401);

  admin.password = newPassword;
  await admin.save();
  return { id: admin._id, email: admin.email, name: admin.name };
};

export const adminService = { getAdminById, changePassword };
export default adminService;
