import { Router } from "express";

import authRoutes from "../modules/auth/auth.routes.js";
import adminRoutes from "../modules/admin/admin.routes.js";
import profileRoutes from "../modules/profile/profile.routes.js";
import experienceRoutes from "../modules/experience/experience.routes.js";
import educationRoutes from "../modules/education/education.routes.js";
import projectRoutes from "../modules/project/project.routes.js";
import publicationRoutes from "../modules/publication/publication.routes.js";
import awardRoutes from "../modules/award/award.routes.js";
import certificationRoutes from "../modules/certification/certification.routes.js";
import membershipRoutes from "../modules/membership/membership.routes.js";
import leadershipRoutes from "../modules/leadership/leadership.routes.js";
import volunteerRoutes from "../modules/volunteer/volunteer.routes.js";
import referenceRoutes from "../modules/reference/reference.routes.js";
import postRoutes from "../modules/post/post.routes.js";
import portfolioRoutes from "../modules/portfolio/portfolio.routes.js";
import contactRoutes from "../modules/contact/contact.routes.js";

const router = Router();

const moduleRoutes = [
  { path: "/auth", route: authRoutes },
  { path: "/admin", route: adminRoutes },
  { path: "/portfolio", route: portfolioRoutes },
  { path: "/profile", route: profileRoutes },
  { path: "/experiences", route: experienceRoutes },
  { path: "/education", route: educationRoutes },
  { path: "/projects", route: projectRoutes },
  { path: "/publications", route: publicationRoutes },
  { path: "/awards", route: awardRoutes },
  { path: "/certifications", route: certificationRoutes },
  { path: "/memberships", route: membershipRoutes },
  { path: "/leadership", route: leadershipRoutes },
  { path: "/volunteer", route: volunteerRoutes },
  { path: "/references", route: referenceRoutes },
  { path: "/posts", route: postRoutes },
   { path: "/contact", route: contactRoutes },
];

moduleRoutes.forEach(({ path, route }) => router.use(path, route));

export default router;
