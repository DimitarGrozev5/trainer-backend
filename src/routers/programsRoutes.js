import express from 'express';

import programsController from '../controllers/programsController.js';
import { isAuth } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Get all workouts for user
router.get('/', isAuth, programsController.getAll);

// Start doing a specific workout
router.post('/', isAuth, programsController.add);

// Get specific workout
router.get('/:programId', isAuth, programsController.get);

// Delete specific workout
router.delete('/:programId', isAuth, programsController.remove);

// Update a specific workout
router.patch('/:programId', isAuth, programsController.update);

export default router;
