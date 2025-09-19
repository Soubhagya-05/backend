import axios from "axios";
import { createSOS } from "../controllers/alert.controller";
import { detectAndHandleObjects } from "../services/detection.service";

export type Detection = {
  object: string;
  confidence: number;
  bbox?: number[]; // [x, y, w, h] normalized
  location?: { lat: number; lng: number };
};

export async function detectFromImageUrl(imageUrl: string): Promise<{ detections: Detection[] }> {
  const apiKey = process.env.ROBOFLOW_API_KEY;
  const modelEndpoint = process.env.ROBOFLOW_MODEL_ENDPOINT;

  if (apiKey && modelEndpoint) {
    try {
      // Roboflow inference example - adapt to your model's API
      const res = await axios.post(
        `${modelEndpoint}?api_key=${apiKey}`,
        { image: imageUrl },
        { timeout: 15000 }
      );
      // Convert provider response to our minimal shape if needed
      return { detections: res.data.predictions || [] };
    } catch (err) {
      console.error("Roboflow detect error:", err);
      return { detections: [] };
    }
  }

  // fallback: mock detection
  const mockLat = Number(process.env.MOCK_LAT || 25.05);
  const mockLng = Number(process.env.MOCK_LNG || 75.05);
  return {
    detections: [
      {
        object: "person",
        confidence: 0.91,
        bbox: [0.1, 0.1, 0.3, 0.5],
        location: { lat: mockLat, lng: mockLng }
      }
    ]
  };
}

export async function detectAndHandleObjects(imageUrl: string, location: { lat: number; lng: number }) {
    const detectedObjects = await detectFromImageUrl(imageUrl); // Existing detection logic

    // Check for specific objects
    const alertObjects = ["bomb", "drone", "gun"];
    const detectedAlertObjects = detectedObjects.detections.filter(obj => alertObjects.includes(obj.class));

    if (detectedAlertObjects.length > 0) {
        // Create an SOS alert with the detected object and location
        await createSOS({
            description: `Detected: ${detectedAlertObjects.map(obj => obj.class).join(", ")}`,
            location,
        });
    }
}

// alert.controller.ts
import { Request, Response } from "express";
import Alert from "../models/alert.model";

export async function createSOS(req: Request, res: Response) {
    try {
        const { description, location } = req.body;

        const alert = new Alert({
            type: "SOS",
            description,
            location, // Include location in the alert
            status: "active",
        });

        await alert.save();

        // Notify clients via WebSocket
        req.app.get("io").emit("newAlert", alert);

        res.status(201).json(alert);
    } catch (error) {
        res.status(500).json({ error: "Failed to create SOS alert" });
    }
}

// alert.routes.ts
router.post("/sos", alertController.createSOS);

// websocket.ts
io.on("connection", (socket) => {
    console.log("Client connected");

    // Emit new alerts
    socket.on("newAlert", (alert) => {
        io.emit("newAlert", alert);
    });
});

// Example: React Dashboard Component
useEffect(() => {
    const socket = io.connect("http://localhost:3000");

    socket.on("newAlert", (alert) => {
        console.log("New Alert Received:", alert);
        // Update dashboard UI with the new alert
    });

    return () => socket.disconnect();
}, []);

// Example API Request
// POST /api/alerts/sos
// Content-Type: application/json
//
// {
//     "description": "Detected: bomb",
//     "location": {
//         "lat": 37.7749,
//         "lng": -122.4194
//     }
// }

camera.on("frame", async (frame) => {
    const imageUrl = await uploadFrameToCloud(frame); // Upload frame to a cloud service
    const location = { lat: 37.7749, lng: -122.4194 }; // Replace with actual camera location

    await detectAndHandleObjects(imageUrl, location);
});
