import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    startDate: { type: String, trim: true },
    endDate: { type: String, trim: true },
    toolsUsed: [{ type: String }],
    details: [{ type: String }],
    imageUrls: [{ type: String }],
    links: {
      github: { type: String, default: "" },
      live: { type: String, default: "" },
      paper: { type: String, default: "" },
    },
    featured: { type: Boolean, default: false },
     isPublic: { type: Boolean, default: true }, // ← ADD THIS LINE
    visibility: [{ type: String, enum: ["job", "academic", "personal"] }],
  },
  { timestamps: true }
);

projectSchema.index({ visibility: 1, isPublic: 1, startDate: -1 });

export const Project = mongoose.model("Project", projectSchema);
export default Project;
