import express from 'express';

import { getAll } from '../controllers/programs/getAllCotroller.js';
import { get } from '../controllers/programs/getController.js';
import { add } from '../controllers/programs/addController.js';
import { remove } from '../controllers/programs/removeController.js';
import { update } from '../controllers/programs/updateController.js';
import { isAuth } from '../middlewares/authMiddleware.js';
import { getUser } from '../middlewares/getUserMiddleware.js';
import { getProgram } from '../middlewares/getProgram.js';
import { getProgramMethods } from '../middlewares/getProgramMethods.js';

const router = express.Router();

// Get all workouts for user
router.get('/', isAuth, getUser, getAll);

// Start doing a specific workout
router.post(
  '/',
  isAuth,
  getUser,
  getProgram({ fromBody: true, exitIfMissing: false }),
  getProgramMethods,
  add
);

// Get specific workout
router.get(
  '/:programId',
  isAuth,
  getUser,
  getProgram({ fromParams: true }),
  get
);

// Delete specific workout
router.delete(
  '/:programId',
  isAuth,
  getUser,
  getProgram({ fromParams: true }),
  remove
);

// Update a specific workout
router.patch(
  '/:programId',
  isAuth,
  getUser,
  getProgram({ fromParams: true }),
  getProgramMethods,
  update
);

export default router;
