import { Request, Response } from "express";
import { postService } from "./post.services";

//get all posts

const getAllPosts = async (req: Request, res: Response) => {
   try {
      const {search} = req.query
       const searchString= typeof search === 'string' ? search : undefined;
      const tags= req.query.tags ? (req.query.tags as string).split(',') : undefined
      const result = await postService.getAllPosts({search:searchString,tags:tags});
      return res.status(200).json(result);
   } catch (error) {
      console.error("Get All Posts Error:", error);
      return res.status(500).json({ error: "Internal Server Error" });
   }
}


   //create post
const createPost = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const result = await postService.createPost(req.body, req.user.id);
    return res.status(201).json(result);
  } catch (error) {
    console.error("Create Post Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};


export const postController = { createPost,
    getAllPosts
 };