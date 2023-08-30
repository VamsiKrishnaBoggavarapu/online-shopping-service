import { Router } from 'express';
import {
  multerImageUploadMiddleware,
  uploadProfilePhoho,
} from '../controllers/userController.js';

const router = Router();

router
  .route('/uploadProfilePhoto')
  .patch(multerImageUploadMiddleware, uploadProfilePhoho);

export default router;
