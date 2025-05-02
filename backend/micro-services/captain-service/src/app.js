import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { fileURLToPath } from "url";
import path, { dirname } from "path";

const filePath = fileURLToPath(import.meta.url);
const __dirname = dirname(filePath);

dotenv.config({
    path: path.resolve(__dirname, "../.env"),
});

const app = express();

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());

export { app };
