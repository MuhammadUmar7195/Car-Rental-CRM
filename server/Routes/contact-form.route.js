import express from 'express';
import { createContactForm, deleteContact, getAllContacts } from '../Controller/contact-form.controller.js';
import { authMiddleware } from '../Middleware/authMiddleware.js';
const router = express.Router();

router.post('/add', createContactForm);
router.get('/get', authMiddleware, getAllContacts);
router.delete('/delete/:id', authMiddleware, deleteContact);

export default router;