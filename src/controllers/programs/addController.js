import HttpError from '../../models/HttpError.js';
import User from '../../models/User.js';
import { programs, eqStates } from '../../programs/index.js';
import { hashValue } from '../../services/hashService.js';
import { rand } from '../../services/randomService.js';

// Start doing a specific program
export const add = async (req, res, next) => {
  // Get program
  const { id, initData, initState } = req.body;

  // Get User
  let user;
  try {
    user = await User.findById(req.userData.userId);
    if (!user) {
      throw 'User not found';
    }
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      'Adding the program failed! Please try again later!',
      500
    );
    return next(error);
  }

  // Make sure the program is not added
  const existingProgram = user.activePrograms.find((pr) => pr.id === id);
  if (existingProgram) {
    console.log('The program already exists');
    const error = new HttpError(
      'The user is allready doing this program!',
      422
    );
    return next(error);
  }

  // Get selected program
  if (!programs.has(id)) {
    console.log('Invalid program id');
    const error = new HttpError('Invalid program id!', 422);
    return next(error);
  }
  const program = programs.get(id);

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
  const initVersion = rand();
  const newProgram = { id, state: initState, version: initVersion };

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
  let hashedVersion;
  try {
    hashedVersion = await hashValue(initVersion);
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      'Adding the program failed! Please try again later!',
      500
    );
    return next(error);
  }

  res.json({ confirmed: true, nextVersion: hashedVersion });
};
