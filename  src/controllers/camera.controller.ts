import { Request, Response } from "express";
import Camera from "../models/camera.model";
import { getIO } from "../utils/websocket";

export const createCamera = async (req: Request, res: Response) => {
  try {
    const cam = await Camera.create(req.body);
    getIO().emit("cameraAdded", cam);
    res.status(201).json(cam);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create camera" });
  }
};

export const listCameras = async (_req: Request, res: Response) => {
  try {
    const cams = await Camera.find().sort({ createdAt: -1 });
    res.json(cams);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to list cameras" });
  }
};

export const getCamera = async (req: Request, res: Response) => {
  try {
    const cam = await Camera.findById(req.params.id);
    if (!cam) return res.status(404).json({ error: "Camera not found" });
    res.json(cam);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to get camera" });
  }
};

export const updateCamera = async (req: Request, res: Response) => {
  try {
    const cam = await Camera.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!cam) return res.status(404).json({ error: "Camera not found" });
    getIO().emit("cameraUpdated", cam);
    res.json(cam);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update camera" });
  }
};

export const deleteCamera = async (req: Request, res: Response) => {
  try {
    const cam = await Camera.findByIdAndDelete(req.params.id);
    if (!cam) return res.status(404).json({ error: "Camera not found" });
    getIO().emit("cameraDeleted", { id: req.params.id });
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete camera" });
  }
};
