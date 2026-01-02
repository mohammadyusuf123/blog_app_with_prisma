import express from "express";
import { postController } from "./post.controller";

const router = express.Router();

router.post("/posts", postController.createPost);

export const postRouter = router;