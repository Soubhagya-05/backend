import mongoose, { Schema, Document } from "mongoose";

export interface IAlert extends Document {
  type: string;
  status: "ACTIVE" | "ACK" | "RESOLVED";
  message?: string;
  location?: { lat: number; lng: number };
  cameraId?: mongoose.Types.ObjectId | string;
  createdAt: Date;
  resolvedAt?: Date | null;
}

const AlertSchema: Schema = new Schema({
  type: { type: String, required: true },
  status: { type: String, enum: ["ACTIVE", "ACK", "RESOLVED"], default: "ACTIVE" },
  message: { type: String },
  location: {
    lat: { type: Number },
    lng: { type: Number }
  },
  cameraId: { type: Schema.Types.ObjectId, ref: "Camera" },
  createdAt: { type: Date, default: Date.now },
  resolvedAt: { type: Date }
});

export default mongoose.model<IAlert>("Alert", AlertSchema);
