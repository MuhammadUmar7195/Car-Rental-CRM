import express from 'express';
import { postFleet, getAllFleets, getSingleFleet, updateFleet, getCarsByStatus, deleteFleet, getTotalCarCount } from '../Controller/fleet.controller.js';
const router = express.Router();

router.post('/add', postFleet);
router.get('/all', getAllFleets);
//get total cars or status available
router.get('/get-count', getTotalCarCount);
//get car with status
router.get('/get-car-status', getCarsByStatus);
//other routes 
router.get('/:id', getSingleFleet);
router.delete('/:id', deleteFleet);
router.put('/edit/:id', updateFleet);

export default router;