const express = require("express");

// const { isAuth } = require("../middlewares/authMiddleware");
const authController = require("../controllers/authController");

const router = express.Router();

// Get all workouts for user
router.get("/", authController.login);

// Get specific workout
router.get("/:workoutId", authController.login);

// Start specific workout
router.post("/:workoutId", authController.login);

// Delete specific workout
router.delete("/:workoutId", authController.login);

// Update a specific workout
router.patch("/:workoutId", authController.login);

module.exports = router;
