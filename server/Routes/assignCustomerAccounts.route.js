import express from 'express';
import { authMiddleware } from '../Middleware/authMiddleware.js';
import { assignCustomerToAccounting } from '../Controller/assignCustomerAccount.controller.js';
const router = express.Router();

router.post('/add', authMiddleware, assignCustomerToAccounting);

export default router;