import express from 'express';
import {
    forgotPassword,
    login,
    logout,
    register,
    resetPassword,
    verifyOTP
} from '../Controller/admin.controller.js';
const router = express.Router();

//Admin routes are here. Used best practice
router.post("/register", register);
router.post("/login", login);

//reset password route
router.post("/forgot-password", forgotPassword);
router.post("/verify-password", verifyOTP);
router.post("/reset-password", resetPassword);

//logout route
router.get("/logout", logout)

export default router;