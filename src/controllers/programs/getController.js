import HttpError from '../../models/HttpError.js';
import { ProgramfromModel } from '../../services/program-transformer.js';

export const get = async (req, res, next) => {
  // Get program
  const fullProgram = req.userData.targetProgram;

  if (!fullProgram) {
    console.log('Program not found!');
    const error = new HttpError(
      'The user is not using this program! Please try again later!',
      404
    );
    return next(error);
  }

  const program = await ProgramfromModel(
    fullProgram.id,
    fullProgram.state,
    fullProgram.salt
  );

  res.json(program);
};
