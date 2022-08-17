const express = require("express");
const { check } = require("express-validator");

// const { isAuth } = require("../middlewares/authMiddleware");
const authController = require("../controllers/authController");

const router = express.Router();

router.post(
  "/register",
  check("email").normalizeEmail.isEmail(),
  check("password").isLength({ min: 6 }),
  authController.register
);
router.post("/login", authController.login);
router.post("/logout", authController.logout);

module.exports = router;
