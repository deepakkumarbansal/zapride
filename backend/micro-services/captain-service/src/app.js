import express from "express";
import cookieParser from "cookie-parser";
import captainRoutes from "./routes/captain.routes.js";

const app = express();

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());

app.use("/", captainRoutes);

export { app };
