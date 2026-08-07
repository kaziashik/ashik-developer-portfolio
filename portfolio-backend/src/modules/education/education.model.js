import mongoose from "mongoose";

const educationSchema = new mongoose.Schema(
  {
    degree: { type: String, required: true, trim: true },
    institution: { type: String, required: true, trim: true },
    location: { type: String, trim: true },
    startDate: { type: String, trim: true },
    endDate: { type: String, trim: true },
    gpa: { type: String, trim: true },
    isPublic: { type: Boolean, default: true },
    visibility: [{ type: String, enum: ["job", "academic", "personal"] }],
  },
  { timestamps: true }
);

educationSchema.index({ visibility: 1, isPublic: 1, startDate: -1 });

export const Education = mongoose.model("Education", educationSchema);
export default Education;
