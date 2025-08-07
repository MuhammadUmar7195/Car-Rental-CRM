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
router.get('/all', authMiddleware, getAllRentals);
router.get('/:id', authMiddleware, getSingleRental);
router.delete('/:id', authMiddleware, deleteRental);
router.put('/edit/:id', authMiddleware, updateRentalStatus);

//get data on the basis of fleetId
router.get('/fleet/:fleetId', authMiddleware, getRentalsByFleetId);
router.get('/customer/:customerId', authMiddleware, getRentalsByCustomerId);
router.put('/inspection/:fleetId', authMiddleware, updateInspectionNameByFleetId);

export default router;