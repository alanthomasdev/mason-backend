import express from 'express';
import { signup, login,  updateFirstLogin } from '../controllers/authController';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/first-login', updateFirstLogin);

export default router;
