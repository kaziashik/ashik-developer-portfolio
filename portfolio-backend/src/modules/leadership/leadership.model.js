import mongoose from "mongoose";

const leadershipSchema = new mongoose.Schema(
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

export const Leadership = mongoose.model("Leadership", leadershipSchema);
export default Leadership;
