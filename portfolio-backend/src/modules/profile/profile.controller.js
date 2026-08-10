import { AppError } from "../../utils/AppError.js";
import { catchAsync } from "../../utils/catchAsync.js";
import { sendResponse } from "../../utils/sendResponse.js";
import { profileService } from "./profile.service.js";

const getProfile = catchAsync(async (req, res) => {
  const profile = await profileService.getProfile();
  sendResponse(res, { statusCode: 200, message: "Profile retrieved", data: profile });
});

const PUBLIC_RESUME_FILENAME = "Ashik_Resume.pdf";

function contentDisposition(filename, type = "inline") {
  const safe = String(filename || PUBLIC_RESUME_FILENAME).replace(/"/g, "");
  const encoded = encodeURIComponent(safe);
  return `${type}; filename="${safe}"; filename*=UTF-8''${encoded}`;
}

const getResume = catchAsync(async (req, res) => {
  const { buffer, contentType } = await profileService.streamResume();
  res.set({
    "Content-Type": contentType,
    "Content-Disposition": contentDisposition(PUBLIC_RESUME_FILENAME, "inline"),
    "Cache-Control": "no-store",
    "Access-Control-Expose-Headers": "Content-Disposition",
  });
  res.send(buffer);
});

const uploadResume = catchAsync(async (req, res) => {
  if (!req.file) {
    throw new AppError("PDF file is required", 400);
  }

  const saved = await profileService.saveResume(req.file.buffer, PUBLIC_RESUME_FILENAME);
  sendResponse(res, {
    statusCode: 200,
    message: "Resume uploaded successfully",
    data: { ok: true, filename: saved.filename },
  });
});

const updateProfile = catchAsync(async (req, res) => {
  const profile = await profileService.updateProfile(req.body);
  sendResponse(res, { statusCode: 200, message: "Profile updated", data: profile });
});

const addSkillCategory = catchAsync(async (req, res) => {
  const skills = await profileService.addSkillCategory(req.params.type, req.body);
  sendResponse(res, { statusCode: 201, message: "Skill category added", data: skills });
});

const updateSkillCategory = catchAsync(async (req, res) => {
  const skill = await profileService.updateSkillCategory(req.params.type, req.params.skillId, req.body);
  sendResponse(res, { statusCode: 200, message: "Skill category updated", data: skill });
});

const deleteSkillCategory = catchAsync(async (req, res) => {
  const skills = await profileService.deleteSkillCategory(req.params.type, req.params.skillId);
  sendResponse(res, { statusCode: 200, message: "Skill category deleted", data: skills });
});

const reorderSkills = catchAsync(async (req, res) => {
  const skills = await profileService.reorderSkills(req.params.type, req.body);
  sendResponse(res, { statusCode: 200, message: "Skill order updated", data: skills });
});

export const profileController = {
  getProfile,
  getResume,
  uploadResume,
  updateProfile,
  addSkillCategory,
  updateSkillCategory,
  deleteSkillCategory,
  reorderSkills,
};

export default profileController;
