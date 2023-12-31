import { Router } from 'express';
import {
  forgotPassword,
  login,
  resetPassword,
  signup,
} from '../controllers/authController.js';

const router = Router();

router.route('/signup').post(signup);
router.route('/login').post(login);
router.route('/forgotPassword').post(forgotPassword);
router.route('/resetPassword').post(resetPassword);

export default router;
