const express = require("express");

// const { isAuth } = require("../middlewares/authMiddleware");
const programsController = require("../controllers/programsController");
const { isAuth } = require("../middlewares/authMiddleware");

const router = express.Router();

// Get all workouts for user
router.get("/", isAuth, programsController.getAll);

// Start doing a specific workout
router.post("/", isAuth, programsController.add);

// Get specific workout
router.get("/:programId", isAuth, programsController.get);

// Delete specific workout
router.delete("/:programId", isAuth, programsController.remove);

// Update a specific workout
router.patch("/:programId", isAuth, programsController.update);

module.exports = router;
