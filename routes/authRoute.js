import { Router } from 'express';
import {
  forgotPassword,
  login,
  signup,
} from '../controllers/authController.js';

const router = Router();

router.route('/signup').post(signup);
router.route('/login').post(login);
router.route('/forgotPassword').post(forgotPassword);

export default router;
