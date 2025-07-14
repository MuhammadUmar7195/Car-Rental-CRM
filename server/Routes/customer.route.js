import express from 'express';
import {
    deleteCustomer,
    getAllCustomers,
    getCustomerByLicenseNo,
    getSingleCustomer,
    postCustomer,
    updateCustomer
} from '../Controller/customer.controller.js';
import { authMiddleware } from '../Middleware/authMiddleware.js';

const router = express.Router();

//Get customers who have a license
router.get('/license/:licenseNo', getCustomerByLicenseNo);

//other routes for crud operations
router.post('/add', authMiddleware, postCustomer);
router.get('/all', getAllCustomers);
router.get('/:id', getSingleCustomer);
router.delete('/:id', authMiddleware, deleteCustomer);
router.put('/edit/:id', authMiddleware, updateCustomer);

export default router;