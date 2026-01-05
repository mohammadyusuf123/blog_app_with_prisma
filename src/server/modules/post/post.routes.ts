import express from "express";
import { postController } from "./post.controller";
import { authMiddleware, UserRole } from "../../../lib/middleware/authMiddleware";

const router = express.Router();
router.get("/", postController.getAllPosts);
router.post("/create-post",authMiddleware(UserRole.USER), postController.createPost);
router.get("/:id", postController.getPostById);

export const postRouter = router;