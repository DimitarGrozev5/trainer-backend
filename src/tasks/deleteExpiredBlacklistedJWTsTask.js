const BlacklistedJWT = require("../models/BlacklistedJWT");

exports.deleteExpiredJWTs = async () => {
  const now = +new Date();
  await BlacklistedJWT.deleteMany({ expiresBy: { $lt: now } });
};
