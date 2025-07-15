import express from 'express';
import { deleteInventoryByID, getAllInventory, getSingleInventory, postInventory, updateInventoryByID } from '../Controller/inventory.controller.js';
import { authMiddleware } from '../Middleware/authMiddleware.js';
const router = express.Router();

router.post('/add', authMiddleware, postInventory);
router.get('/all', authMiddleware, getAllInventory);
router.put('/:id', authMiddleware, updateInventoryByID);
router.get('/get/:id', authMiddleware, getSingleInventory);
router.delete('/:id', authMiddleware, deleteInventoryByID);

export default router;