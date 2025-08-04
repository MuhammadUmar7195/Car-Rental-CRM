import express from "express";
import { authMiddleware } from "../Middleware/authMiddleware.js";
import { getAllWalkInServices, walkInServiceFleet } from "../Controller/walkInService.controller.js";
const router = express.Router();

router.post("/add", authMiddleware, walkInServiceFleet);
router.get("/get", authMiddleware, getAllWalkInServices);

export default router;