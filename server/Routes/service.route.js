import express from "express";  
import { createServiceOrder } from "../Controller/service.controller.js";
import { authMiddleware } from "../Middleware/authMiddleware.js";
const router = express.Router();

router.post("/add", authMiddleware, createServiceOrder);

export default router;