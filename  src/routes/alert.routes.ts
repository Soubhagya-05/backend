import { Router } from "express";
import * as alertController from "../controllers/alert.controller";

const router = Router();

router.post("/", alertController.createAlert);
router.post("/sos", alertController.createSOS);
router.get("/", alertController.listAlerts);
router.put("/:id/ack", alertController.ackAlert);
router.put("/:id/resolve", alertController.resolveAlert);

export default router;
