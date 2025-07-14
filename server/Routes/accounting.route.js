import express from 'express';
import { deleteSingleAccountingData, getAllAccountingData, uploadAccountingFile } from '../Controller/accounting.controller.js';
const router = express.Router();

//upload accounting parse data through this route
router.post('/upload', uploadAccountingFile);
router.get('/all', getAllAccountingData);
router.delete('/:id', deleteSingleAccountingData);

export default router;