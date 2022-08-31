const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const HttpError = require("../models/HttpError");
const User = require("../models/User");
const {saveTokenToBlacklist} = require("./helpers/save-token-to-blacklist")

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
  let existingUser;
  try {
    existingUser = await User.findOne({ email });
  } catch (err) {
    const error = new HttpError(
      "Registration failed! Please try again later!",
      500
    );
    console.log(err);
    return next(error);
  }

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
    console.log(err);
    return next(error);
  }

  // Create new user
  const newUser = new User({
    email,
    password: passwordHash,
    activePrograms: [],
  });

  try {
    await newUser.save();
  } catch (err) {
    const error = new HttpError(
      "Registration failed! Please try again later!",
      500
    );
    console.log(err);
    return next(error);
  }

  // Generate JWT
  let token;
  try {
    token = jwt.sign({ userId: newUser._id }, process.env.jwtKey, {
      expiresIn: "7d",
    });
  } catch (err) {
    const error = new HttpError(
      "The user is created but login failed! Try to login again!",
      511
    );
    console.log(err);
    return next(error);
  }

  // Return new user
  res.status(201).json({
    userId: newUser._id,
    token,
  });
};

exports.login = async (req, res, next) => {
  // Get post data
  const { email, password } = req.body;

  // Find user
  let targetUser;
  try {
    targetUser = await User.findOne({ email });
  } catch (err) {
    const error = new HttpError(
      "Registration failed! Please try again later!",
      500
    );
    console.log(err);
    return next(error);
  }

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
    console.log(err);
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
    console.log(err);
    return next(error);
  }

  // Return user data
  res.status(201).json({
    userId: targetUser._id,
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
    token = jwt.sign({ userId }, process.env.jwtKey, {
      expiresIn: "7d",
    });
  } catch (err) {
    const error = new HttpError("Token refresh failed! Try again later", 500);
    console.log(err);
    return next(error);
  }

  // Return user data
  res.json({
    userId: userId,
    token,
  });

  try {
    await saveTokenToBlacklist(oldToken);
  } catch (err) {
    console.log(err);
  }
};

exports.logout = async (req, res, next) => {
  // Get post data
  const token = req.headers.authorization;

  try {
    await saveTokenToBlacklist(token);
  } catch (err) {
    console.log(err);
    return next(err);
  }

  // Return success
  res.json({
    message: "Success",
  });
};
