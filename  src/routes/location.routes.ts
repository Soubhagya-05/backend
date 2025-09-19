import { Router } from "express";
import * as locationController from "../controllers/location.controller";

const router = Router();

router.post("/", locationController.createLocation);
router.get("/", locationController.listLocations);

export default router;
