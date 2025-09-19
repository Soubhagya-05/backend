import mongoose, { Schema, Document } from "mongoose";

export interface ICamera extends Document {
  name: string;
  type: "laptop" | "ip" | "rtsp" | "mock";
  streamUrl?: string;
  status: "LIVE" | "OFFLINE" | "UNKNOWN";
  meta?: any;
  createdAt: Date;
}

const CameraSchema: Schema = new Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ["laptop", "ip", "rtsp", "mock"], default: "ip" },
  streamUrl: { type: String },
  status: { type: String, enum: ["LIVE", "OFFLINE", "UNKNOWN"], default: "UNKNOWN" },
  meta: { type: Schema.Types.Mixed },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<ICamera>("Camera", CameraSchema);
