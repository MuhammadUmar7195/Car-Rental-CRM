import express from 'express';
import { authMiddleware } from '../Middleware/authMiddleware.js';
import { assignCustomerToAccounting, checkIfAssigned, getAssignedPaymentsByCustomerId } from '../Controller/assignCustomerAccount.controller.js';
const router = express.Router();

router.post('/add', authMiddleware, assignCustomerToAccounting);
router.get('/customer/:customerId', getAssignedPaymentsByCustomerId);
router.get("/check/:accountingId", checkIfAssigned);

export default router;