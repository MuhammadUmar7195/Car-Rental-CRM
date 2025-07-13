import express from 'express';
import {
    deleteCustomer,
    getAllCustomers,
    getCustomerByLicenseNo,
    getSingleCustomer,
    postCustomer,
    updateCustomer
} from '../Controller/customer.controller.js';

const router = express.Router();

//Get customers who have a license
router.get('/license/:licenseNo', getCustomerByLicenseNo);

//other routes for crud operations
router.post('/add', postCustomer);
router.get('/all', getAllCustomers);
router.get('/:id', getSingleCustomer);
router.delete('/:id', deleteCustomer);
router.put('/edit/:id', updateCustomer);

export default router;