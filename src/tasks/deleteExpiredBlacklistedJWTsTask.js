import BlacklistedJWT from "../models/BlacklistedJWT";

export const deleteExpiredJWTs = async () => {
  const now = +new Date();
  await BlacklistedJWT.deleteMany({ expiresBy: { $lt: now } });
};
