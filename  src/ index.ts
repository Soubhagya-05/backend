import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";

import connectDB from "./config/db";
import initSocket from "./utils/websocket";

import cameraRoutes from "./routes/camera.routes";
import alertRoutes from "./routes/alert.routes";
import locationRoutes from "./routes/location.routes";

dotenv.config();

const app = express();
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

// Connect DB
connectDB();

// Health route
app.get("/", (_req, res) => {
  res.json({ ok: true, message: "Raksh backend running 🚀" });
});

// API routes
app.use("/api/cameras", cameraRoutes);
app.use("/api/alerts", alertRoutes);
app.use("/api/locations", locationRoutes);

// HTTP + WebSocket server
const server = http.createServer(app);
const io = new Server(serv
