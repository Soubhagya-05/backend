import mongoose, { Schema, Document } from "mongoose";

export interface ILocation extends Document {
  objectType: string;
  confidence: number;
  lat: number;
  lng: number;
  cameraId?: mongoose.Types.ObjectId | string;
  metadata?: any;
  timestamp: Date;
}

const LocationSchema: Schema = new Schema({
  objectType: { type: String, required: true },
  confidence: { type: Number, default: 0 },
  lat: { type: Number, required: true },
  lng: { type: Number, required: true },
  cameraId: { type: Schema.Types.ObjectId, ref: "Camera" },
  metadata: { type: Schema.Types.Mixed },
  timestamp: { type: Date, default: Date.now }
});

export default mongoose.model<ILocation>("Location", LocationSchema);
