import { catchAsync } from "../../utils/catchAsync.js";
import { sendResponse } from "../../utils/sendResponse.js";
import { authService } from "./auth.service.js";
import config from "../../config/index.js";

const refreshCookieOptions = {
  httpOnly: true,
  secure: config.nodeEnv === "production",
  sameSite: config.nodeEnv === "production" ? "none" : "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const { accessToken, refreshToken, admin } = await authService.login(email, password);

  res.cookie("refreshToken", refreshToken, refreshCookieOptions);

  sendResponse(res, {
    statusCode: 200,
    message: "Logged in successfully",
    data: { accessToken, admin },
  });
});

const refreshToken = catchAsync(async (req, res) => {
  const token = req.cookies?.refreshToken || req.body?.refreshToken;
  const { accessToken } = await authService.refreshAccessToken(token);

  sendResponse(res, {
    statusCode: 200,
    message: "Access token refreshed",
    data: { accessToken },
  });
});

const logout = catchAsync(async (req, res) => {
  res.clearCookie("refreshToken", {
    ...refreshCookieOptions,
    maxAge: undefined,
  });

  sendResponse(res, {
    statusCode: 200,
    message: "Logged out successfully",
    data: null,
  });
});

const getMe = catchAsync(async (req, res) => {
  sendResponse(res, {
    statusCode: 200,
    message: "Current admin",
    data: req.admin,
  });
});

// ✅ FIREBASE LOGIN
const firebaseLogin = catchAsync(async (req, res) => {
  const { idToken } = req.body;
  if (!idToken) {
  throw new AppError("ID token is required", 400);
}

  const result = await authService.firebaseLogin(idToken);

  res.cookie("refreshToken", result.refreshToken, refreshCookieOptions);

  sendResponse(res, {
    statusCode: 200,
    message: "Google login successful",
    data: {
      accessToken: result.accessToken,
      admin: result.admin,
    },
  });
});

export const authController = {
  login,
  refreshToken,
  logout,
  getMe,
  firebaseLogin,
};