import mongoose from "mongoose";

const experienceSchema = new mongoose.Schema(
  {
    role: { type: String, required: true, trim: true },
    organization: { type: String, required: true, trim: true },
    location: { type: String, trim: true },
    startDate: { type: String, trim: true },
    endDate: { type: String, trim: true },
    category: { type: String, enum: ["Research", "Industry", "Teaching"] },
    highlights: [{ type: String }],
      isPublic: { type: Boolean, default: true }, // ← ADD THIS LINE
    visibility: [{ type: String, enum: ["job", "academic", "personal"] }],
  },
  { timestamps: true }
);

experienceSchema.index({ visibility: 1, isPublic: 1, startDate: -1 });

export const Experience = mongoose.model("Experience", experienceSchema);
export default Experience;
