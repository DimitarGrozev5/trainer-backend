import { ProgramfromModel } from '../services/program-transformer.js';

export const validateVersion = async (req, res, next) => {
  // Get received version
  const { version } = req.body;

  // Get program
  const program = req.userData.targetProgram;

  // Get program salt
  const salt = program.salt;

  // Generate comparison hash
  const trueHash = ProgramfromModel(
    program.id,
    program.state,
    program.salt
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
