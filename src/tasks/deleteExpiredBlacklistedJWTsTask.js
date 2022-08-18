// const BlacklistedJWT = require("../models/BlacklistedJWT");

exports.deleteExpiredJWTs = async () => {
  const now = +new Date();
  // TODO: implement with DB
  // await BlacklistedJWT.deleteMany({ expiresBy: { $lt: now } });
};
