import mongoose from "mongoose";

const skillCategorySchema = new mongoose.Schema({
  category: { type: String, required: true, trim: true },
  items: [{ type: String, required: true, trim: true }],
  order: { type: Number, default: 0 },
});

const languageSpokenSchema = new mongoose.Schema(
  {
    language: { type: String, required: true, trim: true },
    level: { type: String, required: true, trim: true },
  },
  { _id: false }
);

const profileSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true },
    email: { type: String, trim: true, lowercase: true },
    phone: { type: String, trim: true },
    location: { type: String, trim: true },
    profileImageUrl: { type: String, default: "" },
    resumePdfUrl: { type: String, default: "" },
    resumeFileId: { type: String, default: "" },
    resumeFileName: { type: String, default: "" },
    links: {
      linkedin: { type: String, default: "" },
      googleScholar: { type: String, default: "" },
      github: { type: String, default: "" },
    },
    researchSummary: { type: String, default: "" },
    researchSkills: [skillCategorySchema],
    developmentSkills: [skillCategorySchema],
    languagesSpoken: [languageSpokenSchema],
  },
  { timestamps: true }
);

export const Profile = mongoose.model("Profile", profileSchema);
export default Profile;
