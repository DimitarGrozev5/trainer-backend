import express from 'express';
import { check } from 'express-validator';

import { isAuth } from '../middlewares/authMiddleware.js';
import * as authController from '../controllers/authController.js';

const router = express.Router();

router.post(
  '/register',
  check('email').normalizeEmail().isEmail(),
  check('password').isLength({ min: 6 }),
  authController.register
);
router.post('/login', authController.login);
router.post('/:userId/refresh', isAuth, authController.refreshToken);
router.post('/:userId/logout', isAuth, authController.logout);

export default router;
