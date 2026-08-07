import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    category: { type: String, enum: ["hobby", "script", "note", "story"], default: "note" },
    content: { type: String, default: "" },
    coverImageUrl: { type: String, default: "" },
    tags: [{ type: String }],
    visibility: [{ type: String, enum: ["job", "academic", "personal"] }],
  },
  { timestamps: true }
);

export const Post = mongoose.model("Post", postSchema);
export default Post;
