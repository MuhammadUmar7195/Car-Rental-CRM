import express from 'express';
import { postFleet, getAllFleets, getSingleFleet, updateFleet } from '../Controller/fleet.controller.js';
const router = express.Router();

router.post('/add', postFleet);
router.get('/all', getAllFleets);
router.get('/:id', getSingleFleet);
router.put('/edit/:id', updateFleet);

export default router;