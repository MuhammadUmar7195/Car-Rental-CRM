import express from 'express';
import { postFleet, getAllFleets } from '../Controller/fleet.controller.js';
const router = express.Router();

router.post('/add', postFleet);
router.get('/all', getAllFleets);

export default router;