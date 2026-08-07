import mongoose from "mongoose";

const publicationSchema = new mongoose.Schema(
  {
    idTag: { type: String, trim: true },
    type: { type: String, enum: ["Journal", "Conference", "Thesis", "Patent", "In Submission"], required: true },
    title: { type: String, required: true, trim: true },
    authors: { type: String, trim: true },
    venue: { type: String, trim: true },
    publicationDate: { type: String, trim: true },
    status: { type: String, enum: ["Published", "In Submission", "Under Review"], default: "Published" },
    indexing: { type: String, trim: true },
    metrics: {
      citeScore: { type: Number },
      impactFactor: { type: Number },
    },
    doiOrLink: { type: String, default: "" },
    featured: { type: Boolean, default: false },
    visibility: [{ type: String, enum: ["job", "academic", "personal"] }],
  },
  { timestamps: true }
);

export const Publication = mongoose.model("Publication", publicationSchema);
export default Publication;
