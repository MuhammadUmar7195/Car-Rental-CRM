import express from 'express';
import {
    deleteSingleAccountingData,
    getAllAccountingData,
    uploadAccountingFile,
    assignCustomerToAccounting,
    checkIfAssigned,
    getAccountingDetailWithCustomerId,
} from '../Controller/accounting.controller.js';
import { authMiddleware } from '../Middleware/authMiddleware.js';
const router = express.Router();

//upload accounting parse data through this route
router.post('/upload', authMiddleware, uploadAccountingFile);
router.get('/all', getAllAccountingData);
router.delete('/:id', authMiddleware, deleteSingleAccountingData);

//we assign the details of accounting with customerId and check status 
router.put('/assign-customer', assignCustomerToAccounting);
router.get('/check-assigned/:accountingId', checkIfAssigned);
router.get('/customer/:customerId', getAccountingDetailWithCustomerId);


export default router;