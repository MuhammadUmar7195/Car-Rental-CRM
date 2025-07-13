import express from 'express';
import { postFleet, getAllFleets, getSingleFleet, updateFleet, getCarsByStatus, deleteFleet } from '../Controller/fleet.controller.js';
const router = express.Router();

router.post('/add', postFleet);
router.get('/all', getAllFleets);
router.get('/get-car-status', getCarsByStatus);
router.get('/:id', getSingleFleet);
router.delete('/:id', deleteFleet);
router.put('/edit/:id', updateFleet);

export default router;