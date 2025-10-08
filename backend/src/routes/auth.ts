import { Router } from 'express';
import { 
  register, 
  login, 
  logout, 
  setup2FA, 
  verify2FA,
  registerValidation,
  loginValidation
} from '../controllers/authController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);
router.post('/logout', logout);
router.post('/2fa/setup', authenticateToken, setup2FA);
router.post('/2fa/verify', authenticateToken, verify2FA);

export default router;