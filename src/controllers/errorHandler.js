/*
 *
 * TODO:
 * Check if the error status is 401 - Unauthorized
 * If so, add the Authorization token to the blacklist
 *
 */

const HttpError = require("../models/HttpError");

exports.errorHandler = (error, req, res, next) => {
  if (res.headerSend) {
    return next();
  }

  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error occured!" });
};

exports.error500 = new HttpError("Възникна грешка! Моля опитайте отново!", 500);
