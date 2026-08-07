import { catchAsync } from "../../utils/catchAsync.js";
import { sendResponse } from "../../utils/sendResponse.js";
import { postService } from "./post.service.js";

const getAllPost = catchAsync(async (req, res) => {
  const items = await postService.getAllPost(req.query);
  sendResponse(res, { statusCode: 200, message: "Post list retrieved", data: items });
});

const getPostById = catchAsync(async (req, res) => {
  const item = await postService.getPostById(req.params.id);
  sendResponse(res, { statusCode: 200, message: "Post retrieved", data: item });
});

const createPost = catchAsync(async (req, res) => {
  const item = await postService.createPost(req.body);
  sendResponse(res, { statusCode: 201, message: "Post created", data: item });
});

const updatePost = catchAsync(async (req, res) => {
  const item = await postService.updatePost(req.params.id, req.body);
  sendResponse(res, { statusCode: 200, message: "Post updated", data: item });
});

const deletePost = catchAsync(async (req, res) => {
  const item = await postService.deletePost(req.params.id);
  sendResponse(res, { statusCode: 200, message: "Post deleted", data: item });
});

export const postController = {
  getAllPost,
  getPostById,
  createPost,
  updatePost,
  deletePost,
};

export default postController;
