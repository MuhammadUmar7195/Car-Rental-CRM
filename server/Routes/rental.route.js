import express from 'express';
import { createRentalOrder, deleteRental, getAllRentals, getSingleRental, sendRentalInvoice } from '../Controller/rental.controller.js';
import { authMiddleware } from '../Middleware/authMiddleware.js';
const router = express.Router();

router.post('/add', authMiddleware, createRentalOrder);
router.post('/send-invoice', sendRentalInvoice);

//get routes rental orders
router.get('/all', getAllRentals);
router.get('/:id', getSingleRental);
router.delete('/:id', authMiddleware, deleteRental);

export default router;