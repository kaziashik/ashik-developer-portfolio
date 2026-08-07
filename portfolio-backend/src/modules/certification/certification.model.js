import mongoose from "mongoose";

const certificationSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    issuer: { type: String, trim: true },
    date: { type: String, trim: true },
    credentialUrl: { type: String, default: "" },
    visibility: [{ type: String, enum: ["job", "academic", "personal"] }],
  },
  { timestamps: true }
);

export const Certification = mongoose.model("Certification", certificationSchema);
export default Certification;
