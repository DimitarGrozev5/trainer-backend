import jwt from 'jsonwebtoken';

import HttpError from '../../models/HttpError';
import BlacklistedJWT from '../../models/BlacklistedJWT';

exports.saveTokenToBlacklist = async (token) => {
  // Check if token is in the blacklist
  let existingToken;
  try {
    existingToken = await BlacklistedJWT.findOne({ token });
  } catch (err) {
    console.log(err);
    const error = new HttpError('Logout failed! Please try again later!', 500);
    throw error;
  }

  // Return success
  if (existingToken) {
    return true;
  }

  // Get expiration date from token
  let expiresBy;
  try {
    const decodedToken = jwt.verify(token, process.env.jwtKey);
    expiresBy = decodedToken.exp * 1000;
  } catch (err) {
    const error = new HttpError('Internal server error!', 401);
    throw error;
  }

  // Add token to blacklist
  const newBlacklistToken = new BlacklistedJWT({ token, expiresBy });
  try {
    await newBlacklistToken.save();
  } catch (err) {
    const error = new HttpError('Logout failed! Please try again later!', 500);
    throw error;
  }

  // Start delete timer
  const timeout = Math.max(0, expiresBy - new Date());

  const deleteTokenAfterTimeout = (timeout) =>
    setTimeout(async () => {
      try {
        // Delete token from blacklist
        await BlacklistedJWT.findOneAndDelete({ token });
      } catch (err) {
        // Start another timer to try the deletion again
        deleteTokenAfterTimeout(10 * 60 * 1000);
        console.log(err);
      }
    }, timeout);

  deleteTokenAfterTimeout(timeout);

  return true;
};
