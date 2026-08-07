import { Admin } from "../admin/admin.model.js";
import { jwtUtils } from "../../utils/jwtUtils.js";
import { AppError } from "../../utils/AppError.js";
import config from "../../config/index.js";
import { auth } from "../../config/firebaseAdmin.js";

const issueTokens = (adminUser) => {
  const payload = {
    id: adminUser._id.toString(),
    email: adminUser.email,
    name: adminUser.name,
  };

  const accessToken = jwtUtils.createToken(
    payload,
    config.jwtAccessSecret,
    config.jwtAccessExpiresIn
  );

  const refreshToken = jwtUtils.createToken(
    payload,
    config.jwtRefreshSecret,
    config.jwtRefreshExpiresIn
  );

  return { accessToken, refreshToken };
};

// LOGIN (email/password)
const login = async (email, password) => {
  if (!email || !password) {
    throw new AppError("Email and password are required", 400);
  }

  const adminUser = await Admin.findOne({ email: email.toLowerCase().trim() }).select("+password");

  if (!adminUser) {
    throw new AppError("Invalid email or password", 401);
  }

  const matches = await adminUser.comparePassword(password);

  if (!matches) {
    throw new AppError("Invalid email or password", 401);
  }

  const tokens = issueTokens(adminUser);

  return {
    ...tokens,
    admin: {
      id: adminUser._id,
      email: adminUser.email,
      name: adminUser.name,
    },
  };
};

// REFRESH TOKEN
const refreshAccessToken = async (refreshToken) => {
  if (!refreshToken) {
    throw new AppError("Refresh token is missing", 401);
  }

  const verified = jwtUtils.verifyToken(refreshToken, config.jwtRefreshSecret);

  if (!verified.success) {
    throw new AppError("Invalid or expired refresh token", 401);
  }

  const { id, email } = verified.data;

  const adminUser = await Admin.findOne({ _id: id, email });

  if (!adminUser) {
    throw new AppError("Admin not found", 401);
  }

  const payload = {
    id: adminUser._id.toString(),
    email: adminUser.email,
    name: adminUser.name,
  };

  const accessToken = jwtUtils.createToken(
    payload,
    config.jwtAccessSecret,
    config.jwtAccessExpiresIn
  );

  return { accessToken };
};

// FIREBASE LOGIN
const firebaseLogin = async (idToken) => {
  if (!idToken) {
    throw new AppError("Firebase token is required", 400);
  }

  const decoded = await auth.verifyIdToken(idToken);

const email = decoded.email;

if (!email) {
  throw new AppError("Invalid Google account", 401);
}

if (!decoded.email_verified) {
  throw new AppError("Email not verified by Google", 401);
}

  if (email !== config.adminEmail) {
  throw new AppError("Unauthorized login", 403);
}

  const adminUser = await Admin.findOne({ email });

  if (!adminUser) {
    throw new AppError("Unauthorized Google login", 403);
  }

  const tokens = issueTokens(adminUser);

  return {
    ...tokens,
    admin: {
      id: adminUser._id,
      email: adminUser.email,
      name: adminUser.name,
    },
  };
};

export const authService = {
  login,
  refreshAccessToken,
  firebaseLogin,
};