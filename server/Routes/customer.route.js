import express from 'express';
import {
    getAllCustomers,
    getCustomersWithLicense,
    getSingleCustomer,
    postCustomer,
    updateCustomer
} from '../Controller/customer.controller.js';

const router = express.Router();

//Get customers who have a license
router.get('/with-license', getCustomersWithLicense);

//other routes for crud operations
router.post('/add', postCustomer);
router.get('/all', getAllCustomers);
router.get('/:id', getSingleCustomer);
router.put('/edit/:id', updateCustomer);

export default router;