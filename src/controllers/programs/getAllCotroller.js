import HttpError from '../../models/HttpError.js';
import User from '../../models/User.js';
import { hashValue } from '../../services/hashService.js';

// TODO: If a program is late, change it's sessionDate to today
// Get all programs for user
export const getAll = async (req, res, next) => {
  const user = req.userData.User;

  // Hash versions
  const activePrograms = await Promise.all(
    user.activePrograms.map(async (pr) => {
      const version = await hashValue(pr.version.toString());
      return { id: pr.id, state: pr.state, version };
    })
  );

  res.json(activePrograms);
};