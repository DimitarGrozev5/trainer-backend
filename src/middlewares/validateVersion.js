import { ProgramfromModel } from '../services/program-transformer.js';
import HttpError from '../models/HttpError.js';

export const validateVersion = () => async (req, res, next) => {
  // Get received version
  const { version } = req.body;

  // Get program
  const program = req.userData.targetProgram;

  // Generate comparison hash
  const trueHash = (
    await ProgramfromModel(program.id, program.state, program.salt)
  )?.version;

  // Validate version
  if (trueHash !== version) {
    console.log("versions don't match");
    const error = new HttpError(
      'Your data is not up to date! Please reload your page!',
      410
    );
    return next(error);
  }

  next();
};
