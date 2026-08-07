import mongoose from "mongoose";

const membershipSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    membershipId: { type: String, trim: true },
    startDate: { type: String, trim: true },
    endDate: { type: String, trim: true },
    visibility: [{ type: String, enum: ["job", "academic", "personal"] }],
  },
  { timestamps: true }
);

export const Membership = mongoose.model("Membership", membershipSchema);
export default Membership;
