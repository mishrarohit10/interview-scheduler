import express from 'express';
import { createJob } from '../controllers/jobController.js';
import { authenticateJWT } from '../middleware/auth.js';

const router = express.Router();

router.post('/create-job', createJob);

export default router;
