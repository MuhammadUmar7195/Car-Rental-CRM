import express from 'express';
import { createRentalOrder, deleteRental, getAllRentals, getSingleRental, sendRentalInvoice } from '../Controller/rental.controller.js';
const router = express.Router();

router.post('/add', createRentalOrder);
router.post('/send-invoice', sendRentalInvoice);

//get routes rental orders
router.get('/all', getAllRentals);
router.get('/:id', getSingleRental);
router.delete('/:id', deleteRental);

export default router;