import express from 'express';
import { postFleet, getAllFleets, getSingleFleet, updateFleet, getCarsByStatus, deleteFleet, getTotalCarCount } from '../Controller/fleet.controller.js';
import { authMiddleware } from '../Middleware/authMiddleware.js';
const router = express.Router();

router.post('/add', authMiddleware, postFleet);
router.get('/all', authMiddleware, getAllFleets);

//get total cars or status available
router.get('/get-count', authMiddleware, getTotalCarCount);

//get car with status
router.get('/get-car-status', getCarsByStatus);

//other routes 
router.get('/:id', authMiddleware, getSingleFleet);
router.delete('/:id', authMiddleware, deleteFleet);
router.put('/edit/:id', authMiddleware, updateFleet);

export default router;