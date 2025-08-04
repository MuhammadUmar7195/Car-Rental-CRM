import express from "express";
import { authMiddleware } from "../Middleware/authMiddleware.js";
import { walkInServiceFleet } from "../Controller/walkInService.controller.js";
const router = express.Router();

router.post("/add", authMiddleware, walkInServiceFleet);

export default router;