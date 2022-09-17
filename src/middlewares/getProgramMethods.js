import { programs } from '../programs/index.js';

export const getProgramMethods = () => (req, res, next) => {
  const id = req.userData.targetProgramId;

  if (!programs.has(id)) {
    console.log('Invalid program id');
    const error = new HttpError('Invalid program id!', 422);
    return next(error);
  }
  const program = programs.get(id);

  req.userData.targetProgramMethods = program;

  next();
};
