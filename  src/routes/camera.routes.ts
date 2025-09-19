import { Router } from "express";
import * as cameraController from "../controllers/camera.controller";

const router = Router();

router.post("/", cameraController.createCamera);
router.get("/", cameraController.listCameras);
router.get("/:id", cameraController.getCamera);
router.put("/:id", cameraController.updateCamera);
router.delete("/:id", cameraController.deleteCamera);

export default router;
