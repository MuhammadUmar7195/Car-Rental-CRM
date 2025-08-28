import express from "express";
import { authMiddleware } from "../Middleware/authMiddleware.js";
import { deleteByIdService, getAllWalkInServices, updateWalkInServiceStatus, walkInServiceFleet } from "../Controller/walkInService.controller.js";
const router = express.Router();

router.post("/add", authMiddleware, walkInServiceFleet);
router.get("/get", authMiddleware, getAllWalkInServices);
router.put("/update/:id", authMiddleware, updateWalkInServiceStatus);
router.delete("/delete/:id", authMiddleware, deleteByIdService);

export default router;