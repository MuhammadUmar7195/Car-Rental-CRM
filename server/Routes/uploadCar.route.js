import express from 'express';
import upload from '../Utils/multer.js';
import { uploadFile } from '../Controller/uploadCar.controller.js';
const router = express.Router();

router.post("/", upload.single("image"), uploadFile);

export default router;