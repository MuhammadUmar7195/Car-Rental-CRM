import express from 'express';
import {
    createRentalOrder,
    deleteRental,
    getAllRentals,
    getRentalsByCustomerId,
    getRentalsByFleetId,
    getSingleRental,
    sendRentalInvoice,
    updateInspectionNameByFleetId,
    updateRentalStatus
} from '../Controller/rental.controller.js';
import { authMiddleware } from '../Middleware/authMiddleware.js';
const router = express.Router();

router.post('/add', authMiddleware, createRentalOrder);
router.post('/send-invoice', sendRentalInvoice);

//get routes rental orders
router.get('/all', getAllRentals);
router.get('/:id', getSingleRental);
router.delete('/:id', authMiddleware, deleteRental);
router.put('/edit/:id', authMiddleware, updateRentalStatus);

//get data on the basis of fleetId
router.get('/fleet/:fleetId', getRentalsByFleetId);
router.get('/customer/:customerId', getRentalsByCustomerId);
router.put('/inspection/:fleetId', updateInspectionNameByFleetId);

export default router;