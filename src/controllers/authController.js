const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const HttpError = require("../models/HttpError");

const USERS = [];

exports.register = async (req, res, next) => {
  // Get post data
  const { email, password } = req.body;

  // Validate input
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    return next(new HttpError("Въведени са невалидни данни! ", 422));
  }

  // Check if user exists
  const existingUser = USERS.find((u) => u.email === email);
  if (existingUser) {
    const error = new HttpError(
      "Потребител с такъв имейл или телефон вече съществува.",
      422
    );
    return next(error);
  }

  // Hash password
  let passwordHash;
  try {
    passwordHash = await bcrypt.hash(password, 12);
  } catch (err) {
    const error = new HttpError(
      "Регистрацията се провали. Моля опитайте пак.",
      500
    );
    return next(error);
  }

  // Create new user
  const newUser = { _id: +new Date(), email, password: passwordHash };
  USERS.push(newUser);

  // Generate JWT
  let token;
  try {
    token = jwt.sign(
      { userId: newUser._id, email: newUser.email },
      process.env.jwtKey,
      { expiresIn: "7d" }
    );
  } catch (err) {
    const error = new HttpError(
      "Потребителят е създаден, но вписването се провали. Моля опитайте да се впишете.",
      511
    );
    return next(error);
  }

  // Return new user
  res.status(201).json({
    userId: newUser.id,
    email: newUser.email,
    token,
  });
};

exports.login = async (req, res, next) => {
  // Get post data
  // Find user
  // Validate password
  // Generate JWT
  // Return user data
};

exports.refreshToken = async (req, res, next) => {
  // Get post data
  // Validate token
  // Check if token is not in blacklist
  // Generate new token
};

exports.logout = async (req, res, next) => {
  // Get post data
  // Get expiration date from token
  // Check if token is in blacklist
  // Add token to blacklist
  // Start delete timer
};
