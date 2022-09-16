import HttpError from '../../models/HttpError.js';
import User from '../../models/User.js';
import { hashValue } from '../../services/hashService.js';

export const get = async (req, res, next) => {
  // Get program id
  const programId = req.params.programId;

  let user;
  try {
    user = await User.findById(req.userData.userId);
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      'Cannot fetch program! Please try again later!',
      500
    );
    return next(error);
  }

  const fullProgram = user.activePrograms.find((pr) => {
    return pr.id === programId;
  });

  if (!fullProgram) {
    console.log('Program not found!');
    const error = new HttpError(
      'The user is not using this program! Please try again later!',
      404
    );
    return next(error);
  }

  // Hash version
  const version = hashValue(fullProgram.version.toString());

  const program = { id: fullProgram.id, state: fullProgram.state, version };

  res.json(program);
};
