import HttpError from '../models/HttpError';
import { saveTokenToBlacklist } from './helpers/save-token-to-blacklist';

export const errorHandler = async (error, req, res, next) => {
  if (res.headerSend) {
    return next();
  }

  res.status(error.code || 500);
  res.json({ message: error.message || 'An unknown error occured!' });

  if (error.code === 401 && req.userData) {
    try {
      await saveTokenToBlacklist(req.userData.userToken);
    } catch (err) {
      console.log(err);
    }
  }
};

export const error500 = new HttpError('Възникна грешка! Моля опитайте отново!', 500);
