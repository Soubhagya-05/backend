import { Request, Response } from "express";
import Alert from "../models/alert.model";
import { getIO } from "../utils/websocket";

export const createAlert = async (req: Request, res: Response) => {
  try {
    const alert = await Alert.create(req.body);
    getIO().emit("newAlert", alert);
    res.status(201).json(alert);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create alert" });
  }
};

export const createSOS = async (req: Request, res: Response) => {
  try {
    const body = { ...req.body, type: "SOS", status: "ACTIVE" };
    const alert = await Alert.create(body);
    getIO().emit("newAlert", alert);
    res.status(201).json(alert);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create SOS alert" });
  }
};

export const listAlerts = async (req: Request, res: Response) => {
  try {
    const { status } = req.query;
    const query: any = {};
    if (status) query.status = status;
    const alerts = await Alert.find(query).sort({ createdAt: -1 });
    res.json(alerts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to list alerts" });
  }
};

export const ackAlert = async (req: Request, res: Response) => {
  try {
    const alert = await Alert.findByIdAndUpdate(req.params.id, { status: "ACK" }, { new: true });
    if (!alert) return res.status(404).json({ error: "Alert not found" });
    getIO().emit("alertUpdated", alert);
    res.json(alert);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to acknowledge alert" });
  }
};

export const resolveAlert = async (req: Request, res: Response) => {
  try {
    const alert = await Alert.findByIdAndUpdate(
      req.params.id,
      { status: "RESOLVED", resolvedAt: new Date() },
      { new: true }
    );
    if (!alert) return res.status(404).json({ error: "Alert not found" });
    getIO().emit("alertUpdated", alert);
    res.json(alert);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to resolve alert" });
  }
};
