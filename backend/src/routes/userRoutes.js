import express from 'express';
import { registerUser, loginUser, verifyEmail, getEmail } from '../controllers/userController.js';

const router = express.Router();

router.post('/signup', registerUser);
router.post('/login', loginUser);
router.post('/verify-email', getEmail);
// router.post('/verify-sms', verifySMS);
router.post('/verify-email/:token', verifyEmail);

export default router;
