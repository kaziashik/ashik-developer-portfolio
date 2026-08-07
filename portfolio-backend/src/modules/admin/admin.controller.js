import { catchAsync } from "../../utils/catchAsync.js";
import { sendResponse } from "../../utils/sendResponse.js";
import { AppError } from "../../utils/AppError.js";
import { adminService } from "./admin.service.js";

const getMe = catchAsync(async (req, res) => {
  const admin = await adminService.getAdminById(req.admin.id);
  sendResponse(res, { statusCode: 200, message: "Admin profile retrieved", data: admin });
});

const changePassword = catchAsync(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    throw new AppError("currentPassword and newPassword are both required", 400);
  }
  const admin = await adminService.changePassword(req.admin.id, currentPassword, newPassword);
  sendResponse(res, { statusCode: 200, message: "Password updated", data: admin });
});

export const adminController = { getMe, changePassword };
export default adminController;
