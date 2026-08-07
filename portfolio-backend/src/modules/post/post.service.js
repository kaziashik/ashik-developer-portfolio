import { Post } from "./post.model.js";
import { AppError } from "../../utils/AppError.js";

const getAllPost = async (query) => {
  const filter = {};
  if (query.visibility !== undefined) filter.visibility = query.visibility;
  if (query.category !== undefined) filter.category = query.category;
  return Post.find(filter).sort({ createdAt: -1 });
};

const getPostById = async (id) => {
  const item = await Post.findById(id);
  if (!item) throw new AppError("Post not found", 404);
  return item;
};

const createPost = async (payload) => {
  return Post.create(payload);
};

const updatePost = async (id, payload) => {
  const item = await Post.findByIdAndUpdate(id, payload, { new: true, runValidators: true });
  if (!item) throw new AppError("Post not found", 404);
  return item;
};

const deletePost = async (id) => {
  const item = await Post.findByIdAndDelete(id);
  if (!item) throw new AppError("Post not found", 404);
  return item;
};

export const postService = {
  getAllPost,
  getPostById,
  createPost,
  updatePost,
  deletePost,
};

export default postService;
