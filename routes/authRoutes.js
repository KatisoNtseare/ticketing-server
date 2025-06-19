//Defines authentication routes for register and login

import express from 'express';
import { loginUser } from '../controllers/authController.js';
import { registerUser } from '../controllers/authController.js';

const router = express.Router();

//Public Routes For Reg and Log in
router.post('/register', registerUser);
router.post('/login', loginUser);


export default router;