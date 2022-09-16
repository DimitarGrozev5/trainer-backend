import HttpError from '../../models/HttpError.js';
import { getSpecificProgram } from '../helpers/get-specific-program.js';

export const get = async (req, res, next) => {
  // Get program id
  const programId = req.params.programId;

  let program;
  try {
    program = await getSpecificProgram(req.userData.userId, programId);
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      'Cannot fetch program! Please try again later!',
      500
    );
    return next(error);
  }

  if (!program) {
    console.log('Program not found!');
    const error = new HttpError(
      'The user is not using this program! Please try again later!',
      404
    );
    return next(error);
  }

  res.json(program);
};
