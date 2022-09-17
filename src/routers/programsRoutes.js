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
import { validateVersion } from '../middlewares/validateVersion.js';
import { getProgramId } from '../middlewares/getProgramId.js';

const router = express.Router();

// Get all workouts for user
router.get('/', isAuth(), getUser(), getAll);

// Start doing a specific workout
router.post(
  '/',
  isAuth(),
  getUser(),
  getProgramId({ fromBody: true }),
  getProgram({ exitIfMissing: false }),
  getProgramMethods({ fromBody: true }),
  add
);

// Get specific workout
router.get(
  '/:programId',
  isAuth(),
  getUser(),
  getProgramId({ fromParams: true }),
  getProgram(),
  get
);

// Delete specific workout
router.delete(
  '/:programId',
  isAuth(),
  getUser(),
  getProgramId({ fromParams: true }),
  getProgram(),
  validateVersion(),
  remove
);

// Update a specific workout
router.patch(
  '/:programId',
  isAuth(),
  getUser(),
  getProgramId({ fromParams: true }),
  getProgram(),
  validateVersion(),
  getProgramMethods(),
  update
);

export default router;
