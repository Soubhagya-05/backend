import { Request, Response } from "express";
import Location from "../models/location.model";
import { getIO } from "../utils/websocket";

export const createLocation = async (req: Request, res: Response) => {
  try {
    const loc = await Location.create(req.body);
    getIO().emit("newLocation", loc);
    res.status(201).json(loc);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create location event" });
  }
};

export const listLocations = async (req: Request, res: Response) => {
  try {
    const { objectType, limit } = req.query;
    const query: any = {};
    if (objectType) query.objectType = objectType;
    const lim = Number(limit) || 50;
    const locs = await Location.find(query).sort({ timestamp: -1 }).limit(lim);
    res.json(locs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to list locations" });
  }
};
