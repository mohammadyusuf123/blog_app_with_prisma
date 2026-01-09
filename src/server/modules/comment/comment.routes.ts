import express from "express";
import { authMiddleware, UserRole } from "../../../lib/middleware/authMiddleware";
import { commentController } from "./comment.controller";

const router = express.Router();
// router.get("/", postController.getAllPosts);
router.post("/create-comment", commentController.createComment);
// router.get("/:id", postController.getPostById);

export const commentRouter = router;