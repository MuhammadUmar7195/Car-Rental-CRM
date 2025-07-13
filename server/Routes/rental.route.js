import express from 'express';
import { createRentalOrder, getAllRentals, getSingleRental, sendRentalInvoice } from '../Controller/rental.controller.js';
const router = express.Router();

router.post('/add', createRentalOrder);
router.post('/send-invoice', sendRentalInvoice);

//get routes rental orders
router.get('/all', getAllRentals);
router.get('/:id', getSingleRental);

export default router;