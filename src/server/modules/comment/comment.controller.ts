import { Request, Response } from "express";
import { commentService } from "./comment.services";



//create comment
const createComment = async (req: Request, res: Response) => {
    try {
        const user = req.user
        req.body.authorId = user?.id
        const result = await commentService.createComment(req.body);
        return res.status(201).json(result);
    } catch (error) {
        console.error("Create Comment Error:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};



export const commentController = {
    createComment
}