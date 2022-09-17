import { validIds } from '../programs/index.js';

export const getProgramId =
  ({ fromParams = true, fromBody = false } = {}) =>
  async (req, res, next) => {
    // Get id
    let id = undefined;
    if (fromParams) {
      id = req.params.programId;
    }
    if (fromBody) {
      id = req.body?.id;
    }

    // If id is null or undefined throw error
    if (id === undefined) {
      console.log('ID not provided');
      const error = new HttpError('No id provided!', 422);
      return next(error);
    }

    // Check if the id is valid
    if (!validIds.find((i) => i === id)) {
      console.log('ID is invalid');
      const error = new HttpError('Id is invalid!', 422);
      return next(error);
    }

    req.userData.targetProgramId = id;
    next();
  };
