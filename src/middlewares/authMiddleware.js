const jwt = require("jsonwebtoken");

const HttpError = require("../models/HttpError");

exports.isAuth = (req, res, next) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      throw "No value is passed to authorization header";
    }

    // Verify JWT
    const decodedToken = jwt.verify(token, process.env.jwtKey);

    // TODO: Check if token is in blacklist

    // Decorate request
    req.userData = { userId: decodedToken.userId };

    next();
  } catch (err) {
    console.log(err);
    const error = new HttpError("Authentication failed!", 401);
    return next(error);
  }
};
