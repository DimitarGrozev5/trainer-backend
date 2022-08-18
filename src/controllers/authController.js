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
    userId: newUser._id,
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
    return next(error);
  }

  // Return user data
  res.json({
    userId: userId,
    token,
  });

  // TODO: Add old token to blacklist
};

exports.logout = async (req, res, next) => {
  // Get post data
  const token = req.headers.authorization;

  // Add token to blacklist

  // Return success
  res.json({ message: "Successfully loged out!" });

  // Get expiration date from token
  let expiresBy;
  try {
    const decodedToken = jwt.verify(token, process.env.jwtKey);
    expiresBy = decodedToken.exp * 1000;
  } catch (err) {
    const error = new HttpError("Internal server error!", 401);
    return next(error);
  }

  // Start delete timer
  const timeout = Math.max(0, expiresBy - new Date());

  const deleteTokenAfterTimeout = (timeout) =>
    setTimeout(async () => {
      try {
        // Delete token from blacklist
        // await BlacklistedJWT.findOneAndDelete({ token });
      } catch (err) {
        // Start another timer to try the deletion again
        deleteTokenAfterTimeout(10 * 60 * 1000);
        console.log(err);
      }
    }, timeout);

  deleteTokenAfterTimeout(timeout);
};
