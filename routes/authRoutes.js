import { Router } from 'express';
import { registerUser, loginUser, getMe, logout } from '../controllers/authController.js';
import authenticate from '../middleware/authMiddleware.js';

const router = Router();

// Public routes (no auth needed)
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected routes (auth required)
router.get('/me', authenticate, getMe);
router.post('/logout', authenticate, logout);

export default router;
