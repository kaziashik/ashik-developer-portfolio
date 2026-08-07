import mongoose from "mongoose";

const awardSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    issuer: { type: String, trim: true },
    year: { type: Number },
    prize: { type: String, default: "" },
    description: { type: String, default: "" },
    certificateUrl: { type: String, default: "" },
    visibility: [{ type: String, enum: ["job", "academic", "personal"] }],
  },
  { timestamps: true }
);

export const Award = mongoose.model("Award", awardSchema);
export default Award;
