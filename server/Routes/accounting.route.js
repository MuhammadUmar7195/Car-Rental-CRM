import express from 'express';
import { deleteSingleAccountingData, getAllAccountingData, uploadAccountingFile } from '../Controller/accounting.controller.js';
import { authMiddleware } from '../Middleware/authMiddleware.js';
const router = express.Router();

//upload accounting parse data through this route
router.post('/upload', authMiddleware, uploadAccountingFile);
router.get('/all', getAllAccountingData);
router.delete('/:id', authMiddleware, deleteSingleAccountingData);

export default router;