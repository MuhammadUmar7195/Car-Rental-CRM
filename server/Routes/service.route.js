import express from "express";
import {
    createServiceOrder,
    deleteServiceOrder,
    getAllServiceOrder,
    getSingleServiceOrder,
    updateServiceOrderStatus
} from "../Controller/service.controller.js";
import { authMiddleware } from "../Middleware/authMiddleware.js";
const router = express.Router();

router.post("/add", authMiddleware, createServiceOrder);
router.get("/all", authMiddleware, getAllServiceOrder);
router.put("/status/:id", authMiddleware, updateServiceOrderStatus);
router.delete("/:id", authMiddleware, deleteServiceOrder);

//Get all service orders by Fleet ID
router.get("/fleet/:fleetId", getSingleServiceOrder);

export default router;