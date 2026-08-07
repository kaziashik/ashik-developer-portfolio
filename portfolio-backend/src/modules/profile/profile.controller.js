import { AppError } from "../../utils/AppError.js";
import { catchAsync } from "../../utils/catchAsync.js";
import { sendResponse } from "../../utils/sendResponse.js";
import { profileService } from "./profile.service.js";

const getProfile = catchAsync(async (req, res) => {
  const profile = await profileService.getProfile();
  sendResponse(res, { statusCode: 200, message: "Profile retrieved", data: profile });
});

const getResume = catchAsync(async (req, res) => {
  const { buffer, contentType } = await profileService.streamResume();
  res.set({
    "Content-Type": contentType,
    "Content-Disposition": 'inline; filename="CV.pdf"',
    "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
  });
  res.send(buffer);
});

const uploadResume = catchAsync(async (req, res) => {
  if (!req.file) {
    throw new AppError("PDF file is required", 400);
  }

  await profileService.saveResume(req.file.buffer, req.file.originalname || "cv.pdf");
  sendResponse(res, { statusCode: 200, message: "CV uploaded successfully", data: { ok: true } });
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
