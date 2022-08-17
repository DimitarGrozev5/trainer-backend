const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const HttpError = require("../models/HttpError");

exports.register = async (req, res, next) => {
  // Get post data
  const { email, password } = req.body;

  // Validate input
  

  // Check if user exists
  // Hash password
  // Create new user
  // Generate JWT
  // Return new user
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
