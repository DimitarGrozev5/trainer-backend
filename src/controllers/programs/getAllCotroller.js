import { ProgramfromModel } from '../../services/program-transformer.js';

// TODO: If a program is late, change it's sessionDate to today
// Get all programs for user
export const getAll = async (req, res, next) => {
  const user = req.userData.User;

  // Hash versions
  const activePrograms = await Promise.all(
    user.activePrograms.map(async (pr) =>
      ProgramfromModel(pr.id, pr.state, pr.salt)
    )
  );

  res.json(activePrograms);
};
