const jwt = require("jsonwebtoken");
const BlacklistedJWT = require("../models/BlacklistedJWT");

const HttpError = require("../models/HttpError");

exports.isAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      throw "No value is passed to authorization header";
    }

    // Verify JWT
    const decodedToken = jwt.verify(token, process.env.jwtKey);

    // Check if token is in blacklist
    let blacklistedToken;
    try {
      blacklistedToken = await BlacklistedJWT.findOne({ token });
    } catch (err) {
      console.log(err);
    }
    if (blacklistedToken) {
      throw "Provided token is blacklisted";
    }

    // Decorate request
    req.userData = { userId: decodedToken.userId, userToken: token };

    next();
  } catch (err) {
    console.log(err);
    const error = new HttpError("Authentication failed!", 401);
    return next(error);
  }
};
