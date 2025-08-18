import express from 'express';
import {
    userLogin,
    userRegister,
    logout,
} from '../Controller/user.controller.js';
const router = express.Router();

//User routes are here. Used best practice
router.post("/register", userRegister);
router.post("/login", userLogin);


//logout route
router.get("/logout", logout);

export default router;