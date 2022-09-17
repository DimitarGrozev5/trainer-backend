import HttpError from '../models/HttpError.js';

export const getProgram =
  ({ exitIfMissing = true } = {}) =>
  async (req, res, next) => {
    // Get id
    let id = req.userData.targetProgramId;

    // Get user
    const user = req.userData.User;

    // Get program
    const program = user.activePrograms.find((pr) => pr.id === id);
    if (exitIfMissing && !program) {
      console.log('ID missing in active programs');
      const error = new HttpError("This program isn't active!", 404);
      return next(error);
    }

    req.userData.targetProgram = program;
    next();
  };
