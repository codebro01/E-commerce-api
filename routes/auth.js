import {loginUser, registerUser, logoutUser, verifyEmail} from '../controllers/authController.js';
import express from 'express';
import { authMiddleware } from '../middlewares/authMiddleware.js';
const router = express.Router();


router.route('/register')
    .post(registerUser);
router.route('/login')
    .post(loginUser);
router.route('/logout')
    .post(logoutUser);
router.route('/verify-email')
    .get( verifyEmail)


export default router;

