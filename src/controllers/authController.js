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
    return next(new HttpError("Invalid input! ", 422));
  }

  // Check if user exists
  const existingUser = USERS.find((u) => u.email === email);
  if (existingUser) {
    const error = new HttpError("Such an user already exists!", 422);
    return next(error);
  }

  // Hash password
  let passwordHash;
  try {
    passwordHash = await bcrypt.hash(password, 12);
  } catch (err) {
    const error = new HttpError("Registration failed! Please try again!", 500);
    return next(error);
  }

  // Create new user
  const newUser = { _id: +new Date(), email, password: passwordHash };
  USERS.push(newUser);

  // Generate JWT
  let token;
  try {
    token = jwt.sign({ userId: newUser._id }, process.env.jwtKey, {
      expiresIn: "7d",
    });
  } catch (err) {
    const error = new HttpError(
      "The user is created but login failed! Please login!",
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
  const { email, password } = req.body;

  // Find user
  const targetUser = USERS.find((u) => u.email === email);
  if (!targetUser) {
    const error = new HttpError("Wrong email or password!", 422);
    return next(error);
  }

  // Validate password
  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, targetUser.password);
  } catch (err) {
    const error = new HttpError("Login failed! Please try again!", 500);
    return next(error);
  }

  if (!isValidPassword) {
    const error = new HttpError("Wrong email or password!", 422);
    return next(error);
  }

  // Generate JWT
  let token;
  try {
    token = jwt.sign({ userId: targetUser._id }, process.env.jwtKey, {
      expiresIn: "7d",
    });
  } catch (err) {
    const error = new HttpError("Login failed! Please try again!", 500);
    return next(error);
  }

  // Return user data
  res.status(201).json({
    userId: targetUser.id,
    email: targetUser.email,
    token,
  });
};

exports.refreshToken = async (req, res, next) => {
  // The Route is guarded, so we can be sure that the token is valid and not blacklisted

  // Get data
  const userId = req.params.userId;
  const oldToken = req.headers.authorization;

  // Generate new token
  let token;
  try {
    token = jwt.sign({ userId: targetUser._id }, process.env.jwtKey, {
      expiresIn: "7d",
    });
  } catch (err) {
    const error = new HttpError("Login failed! Please try again!", 500);
    return next(error);
  }

  // Return user data
  res.status(201).json({
    userId: targetUser.id,
    email: targetUser.email,
    token,
  });
};

exports.logout = async (req, res, next) => {
  // Get post data
  // Get expiration date from token
  // Check if token is in blacklist
  // Add token to blacklist
  // Start delete timer
};
