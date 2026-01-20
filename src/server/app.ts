import express from "express";
import { toNodeHandler } from "better-auth/node";
import { auth } from "../lib/auth";
import cors from "cors"
import { postRouter } from "./modules/post/post.routes";
import { commentRouter } from "./modules/comment/comment.routes";
import errorHandler from "../lib/middleware/globalErrorHandler";
import { notFound } from "../lib/middleware/notFound";

const app = express();

// CORS must come BEFORE all routes
app.use(cors({
    origin: "http://localhost:3000",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
}));

app.use(express.json());

// Auth routes (now CORS is already applied)
app.all('/api/auth/*splat', toNodeHandler(auth));
 
// Post routes
app.use("/posts", postRouter);

// Comment routes
app.use("/comments", commentRouter);

// Home route
app.route("/").get((req, res) => {
    res.send("Hello, World!");
});

// Not found handler
app.use(notFound);

// Error handler
app.use(errorHandler);

export { app };