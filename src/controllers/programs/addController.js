import HttpError from '../../models/HttpError.js';
import { eqStates } from '../../programs/index.js';
import { getHash, getSalt } from '../../services/hashService.js';

// Start doing a specific program
export const add = async (req, res, next) => {
  // Get program
  const { id, initData, initState } = req.body;

  // Get User
  const user = req.userData.User;

  // Make sure the program is not added
  const existingProgram = req.userData.targetProgram;
  if (existingProgram) {
    console.log('The program already exists');
    const error = new HttpError(
      'The user is allready doing this program!',
      422
    );
    return next(error);
  }

  // Get selected program
  const program = req.userData.targetProgramMethods;

  // Generate initState for program
  const tInitData = await program.transformInitData(initData);
  if (!tInitData) {
    console.log('Invalid init data');
    const error = new HttpError('Invalid init data!', 422);
    return next(error);
  }
  const gInitState = program.getInitData(tInitData);

  // Compare passed initState, to generated initState
  const areEqual = eqStates(initState, gInitState);
  if (!areEqual) {
    console.log('Invalid InitState passed');
    const error = new HttpError('Invalid data!', 422);
    return next(error);
  }

  // Add newProgram to User
  const salt = await getSalt();
  const newProgram = { id, state: initState, salt };

  // Add program to user
  user.activePrograms.push(newProgram);
  try {
    await user.save();
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      'Adding the program failed! Please try again later!',
      500
    );
    return next(error);
  }

  // Return new program
  const hashableData = JSON.stringify({ id, state: initState, salt });

  // Extract only the hash
  const versionHash = await getHash(hashableData, salt);

  res.json({ confirmed: true, version: versionHash });
};
