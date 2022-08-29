const express = require("express");

// const { isAuth } = require("../middlewares/authMiddleware");
const programsController = require("../controllers/programsController");

const router = express.Router();

// Get all workouts for user
router.get("/", programsController.getAll);

// Get specific workout
router.get("/:programId", programsController.get);

// Start doing a specific workout
router.post("/:programId", programsController.add);

// Delete specific workout
router.delete("/:programId", programsController.remove);

// Update a specific workout
router.patch("/:programId", programsController.update);

module.exports = router;
