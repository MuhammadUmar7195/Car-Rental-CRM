import express from 'express';
import { authMiddleware } from '../Middleware/authMiddleware.js';
import { assignCustomerToAccounting, deleteAccountingById } from '../Controller/assignCustomerAccount.controller.js';
const router = express.Router();

router.post('/add', authMiddleware, assignCustomerToAccounting);
router.delete('/delete/:accountingId', authMiddleware, deleteAccountingById);

export default router;