import mongoose from "mongoose";

const volunteerSchema = new mongoose.Schema(
  {
    role: { type: String, required: true, trim: true },
    organization: { type: String, trim: true },
    startDate: { type: String, trim: true },
    endDate: { type: String, trim: true },
    details: [{ type: String }],
    visibility: [{ type: String, enum: ["job", "academic", "personal"] }],
  },
  { timestamps: true }
);

export const Volunteer = mongoose.model("Volunteer", volunteerSchema);
export default Volunteer;
