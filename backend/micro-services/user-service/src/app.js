import express from "express";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import path, { dirname } from "path";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/user.routes.js";

const filepath = fileURLToPath(import.meta.url);
const __dirname = dirname(filepath);

dotenv.config({
    path: path.resolve(__dirname, "../.env"),
});

const app = express();

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());

app.use("/", userRoutes);

export { app };
