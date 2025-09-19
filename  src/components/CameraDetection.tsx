import { useEffect, useRef } from "react";
import * as cocoSsd from "@tensorflow-models/coco-ssd";
import "@tensorflow/tfjs";

function CameraDetection() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Load camera
    navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
      if (videoRef.current) videoRef.current.srcObject = stream;
    });

    // Load model
    cocoSsd.load().then((model) => {
      setInterval(async () => {
        if (videoRef.current && canvasRef.current) {
          const predictions = await model.detect(videoRef.current);

          const ctx = canvasRef.current.getContext("2d");
          if (!ctx) return;
          ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
          ctx.drawImage(videoRef.current, 0, 0);

          predictions.forEach((p) => {
            if (p.score > 0.6) {
              ctx.strokeStyle = "red";
              ctx.lineWidth = 2;
              ctx.strokeRect(p.bbox[0], p.bbox[1], p.bbox[2], p.bbox[3]);
              ctx.fillText(p.class, p.bbox[0], p.bbox[1] > 10 ? p.bbox[1] - 5 : 10);

              // 🚨 Alert if drone/bomb detected
              if (p.class === "drone" || p.class === "bomb") {
                fetch("http://localhost:5000/api/alerts", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ type: p.class }),
                });
              }
            }
          });
        }
      }, 1000);
    });
  }, []);

  return (
    <div>
      <video ref={videoRef} autoPlay playsInline width="640" height="480" />
      <canvas ref={canvasRef} width="640" height="480" />
    </div>
  );
}

export default CameraDetection;
