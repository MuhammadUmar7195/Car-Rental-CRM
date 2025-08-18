import express from 'express';
import {
    adminLogin,
    adminRegister,
    forgotPassword,
    resetPassword,
    verifyOTP,
    logout,
} from '../Controller/admin.controller.js';
const router = express.Router();

//User routes are here. Used best practice
router.post("/register", adminRegister);
router.post("/login", adminLogin);

//reset password route
router.post("/forgot-password", forgotPassword);
router.post("/verify-password", verifyOTP);
router.post("/reset-password", resetPassword);

//logout route
router.get("/logout", logout);

export default router;