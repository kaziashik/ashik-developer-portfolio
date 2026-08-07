import mongoose from "mongoose";

const referenceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    title: { type: String, trim: true },
    institution: { type: String, trim: true },
    email: { type: String, trim: true },
    phone: { type: String, trim: true },
    relationship: { type: String, trim: true },
    visibility: [{ type: String, enum: ["job", "academic", "personal"] }],
  },
  { timestamps: true }
);

export const Reference = mongoose.model("Reference", referenceSchema);
export default Reference;
