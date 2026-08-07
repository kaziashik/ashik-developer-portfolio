import { catchAsync } from "../utils/catchAsync.js";
import { jwtUtils } from "../utils/jwtUtils.js";
import { AppError } from "../utils/AppError.js";
import { Admin } from "../modules/admin/admin.model.js";
import config from "../config/index.js";

export const auth = () => {
  return catchAsync(async (req, res, next) => {
    const token = req.headers.authorization?.startsWith("Bearer")
      ? req.headers.authorization.split(" ")[1]
      : req.headers.authorization;

    if (!token) {
      throw new AppError("You are not logged in. Please log in to access this resource.", 401);
    }

    const verified = jwtUtils.verifyToken(token, config.jwtAccessSecret);
    if (!verified.success) {
      throw new AppError(verified.error || "Invalid or expired token", 401);
    }

    const { id, email } = verified.data;
    const admin = await Admin.findOne({ _id: id, email });

    if (!admin) {
      throw new AppError("Admin not found. Please log in again.", 401);
    }

    req.admin = { id: admin._id.toString(), email: admin.email, name: admin.name };
    next();
  });
};

export default auth;
