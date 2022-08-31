const HttpError = require("../models/HttpError");
const { saveTokenToBlacklist } = require("./helpers/save-token-to-blacklist");

exports.errorHandler = async (error, req, res, next) => {
  if (res.headerSend) {
    return next();
  }

  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error occured!" });

  if (error.code === 401 && req.userData) {
    try {
      await saveTokenToBlacklist(req.userData.userToken);
    } catch (err) {
      console.log(err);
    }
  }
};

exports.error500 = new HttpError("Възникна грешка! Моля опитайте отново!", 500);
