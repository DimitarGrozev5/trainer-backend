import HttpError from '../../models/HttpError.js';
import User from '../../models/User.js';
import { hashValue } from '../../services/hashService.js';

// TODO: If a program is late, change it's sessionDate to today
// Get all programs for user
export const getAll = async (req, res, next) => {
  let user;
  try {
    user = await User.findById(req.userData.userId);
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      'Cannot fetch programs! Please try again later!',
      500
    );
    return next(error);
  }

  // Hash versions
  const activePrograms = await Promise.all(
    user.activePrograms.map(async (pr) => {
      const version = await hashValue(pr.version.toString());
      return { id: pr.id, state: pr.state, version };
    })
  );

  res.json(activePrograms);
};
