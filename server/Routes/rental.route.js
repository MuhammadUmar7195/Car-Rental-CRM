import express from 'express';
import { createRentalOrder } from '../Controller/rental.controller.js';
const router = express.Router();

router.post('/add', createRentalOrder);

export default router;