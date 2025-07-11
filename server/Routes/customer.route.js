import express from 'express';
import {
    getAllCustomers,
    getSingleCustomer,
    postCustomer,
    updateCustomer
} from '../Controller/customer.controller.js';

const router = express.Router();

router.post('/add', postCustomer);
router.get('/all', getAllCustomers);
router.get('/:id', getSingleCustomer);
router.put('/edit/:id', updateCustomer);

export default router;