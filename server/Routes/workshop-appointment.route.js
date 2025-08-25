import express from "express";
import { authMiddleware } from "../Middleware/authMiddleware.js";
import { deleteWorkshopAppointment, getAllWorkshopAppointments, workShopAppointment } from "../Controller/workshop-appointment.controller.js";
const router = express.Router();

router.post("/add", workShopAppointment); //every customer create workshop appointment
router.get("/get", authMiddleware, getAllWorkshopAppointments);
router.delete("/delete/:id", authMiddleware, deleteWorkshopAppointment);

export default router;