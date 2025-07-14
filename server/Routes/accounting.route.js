import express from 'express';
import { getAllAccountingData, uploadAccountingFile } from '../Controller/accounting.controller.js';
const router = express.Router();

//upload accounting parse data through this route
router.post('/upload', uploadAccountingFile);
router.get('/all', getAllAccountingData);

export default router;