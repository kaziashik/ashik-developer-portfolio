import { profileService } from "../profile/profile.service.js";
import { experienceService } from "../experience/experience.service.js";
import { educationService } from "../education/education.service.js";
import { projectService } from "../project/project.service.js";

const getPublicPortfolio = async (query) => {
  const [profile, experiences, education, projects] = await Promise.all([
    profileService.getProfile(),
    experienceService.getAllExperience(query),
    educationService.getAllEducation(query),
    projectService.getAllProject(query),
  ]);

  return { profile, experiences, education, projects };
};

const getAdminPortfolio = async (query) => {
  const [profile, experiences, education, projects] = await Promise.all([
    profileService.getProfile(),
    experienceService.getAllExperienceForAdmin(query),
    educationService.getAllEducationForAdmin(query),
    projectService.getAllProjectForAdmin(query),
  ]);

  return { profile, experiences, education, projects };
};

export const portfolioService = {
  getPublicPortfolio,
  getAdminPortfolio,
};

export default portfolioService;
