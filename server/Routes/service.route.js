import express from "express";
import {
    createServiceOrder,
    deleteServiceOrder,
    getAllServiceOrder,
    updateServiceOrderStatus
} from "../Controller/service.controller.js";
import { authMiddleware } from "../Middleware/authMiddleware.js";
const router = express.Router();

router.post("/add", authMiddleware, createServiceOrder);
router.get("/all", authMiddleware, getAllServiceOrder);
router.put("/status/:id", authMiddleware, updateServiceOrderStatus);
router.delete("/:id", authMiddleware, deleteServiceOrder);

export default router;