import express from "express";
import { toNodeHandler } from "better-auth/node";
import { auth } from "../lib/auth";
import cors from "cors"
import { postRouter } from "./modules/post/post.routes";
import { commentRouter } from "./modules/comment/comment.routes";
const app = express();
app.use(express.json());
app.all('/api/auth/*splat', toNodeHandler(auth));
 //adding cors middleware
 app.use(cors({
    origin: process.env.APP_URL,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
 }))
// post routes
app.use("/posts", postRouter);
//comment routes
app.use("/comments", commentRouter);
app.route("/").get((req, res) => {
    res.send("Hello, World!");
});

export { app };