import express from "express";
import { postRouter } from "./modules/post/post.routes";
import { toNodeHandler } from "better-auth/node";
import { auth } from "../lib/auth";
import cors from "cors"
const app = express();
app.use(express.json());
app.all('/api/auth/*splat', toNodeHandler(auth));
 //adding cors middleware
 app.use(cors({
    origin: process.env.APP_URL,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
 }))
// Import and use post routes
app.use("/posts", postRouter);
app.route("/").get((req, res) => {
    res.send("Hello, World!");
});

export { app };