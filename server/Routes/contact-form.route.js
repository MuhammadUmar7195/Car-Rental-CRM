import express from 'express';
import { createContactForm, getAllContacts } from '../Controller/contact-form.controller.js';
import { authMiddleware } from '../Middleware/authMiddleware.js';
const router = express.Router();

router.post('/add', createContactForm);
router.get('/get', authMiddleware, getAllContacts);

export default router;