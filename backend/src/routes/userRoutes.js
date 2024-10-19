import express from 'express';
import { registerUser, loginUser, verifySMS, verifyEmail } from '../controllers/userController.js';

const router = express.Router();

router.post('/signup', registerUser);
router.post('/login', loginUser);
router.post('/verify-sms', verifySMS);
router.get('/verify-email/:token', verifyEmail);

export default router;
