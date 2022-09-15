import HttpError from '../models/HttpError';
import User from '../models/User';
import { programs, eqStates } from '../programs';
import { hashValue, validateHash } from '../services/hashService';
import { rand, nextRand } from '../services/randomService';
import { validateProgram } from '../utils/validate-program';

// TODO: If a program is late, change it's sessionDate to today
// Get all programs for user
export const getAll = async (req, res, next) => {
  let user;
  try {
    user = await User.findById(req.userData.userId);
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      'Cannot fetch programs! Please try again later!',
      500
    );
    return next(error);
  }

  // Hash versions
  const activePrograms = await Promise.all(
    user.activePrograms.map(async (pr) => {
      const version = await hashValue(pr.version.toString());
      return { id: pr.id, state: pr.state, version };
    })
  );

  res.json(activePrograms);
};

// Get specific program
const getSpecificProgram = async (userId, programId) => {
  let user;
  try {
    user = await User.findById(userId);
  } catch (err) {
    throw err;
  }

  const program = user.activePrograms.find((pr) => {
    return pr.id === programId;
  });

  // Hash version
  const version = hashValue(program.version.toString());

  return { id: program.id, state: program.state, version };
};

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
  const gInitState = program.getInitData(initData);

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

// Delete specific program
export const remove = async (req, res, next) => {
  // Get program id and version
  const programId = req.params.programId;
  const { version } = req.body;

  // Get user
  let user;
  try {
    user = await User.findById(req.userData.userId);
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      'Cannot remove program! Please try again later!',
      500
    );
    return next(error);
  }

  // Find program by programId
  const program = user.activePrograms.find((pr) => pr.id === programId);
  if (!program) {
    console.log('ID missing in active programs');
    const error = new HttpError("This program isn't active!", 404);
    return next(error);
  }
  const actualVersion = program.version.toString();

  // Validate version
  const isValid = await validateHash(actualVersion, version);
  if (!isValid) {
    console.log("versions don't match");
    const error = new HttpError(
      'Your data is not up to date! Please reload your page!',
      410
    );
    return next(error);
  }

  // Find and remove program by programId
  user.activePrograms = user.activePrograms.filter((pr) => {
    if (pr.id === programId) {
      return false;
    }

    return true;
  });

  try {
    await user.save();
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      'Cannot remove program! Please try again later!',
      500
    );
    return next(error);
  }

  res.json({ success: true });
};

// Update a specific program
export const update = async (req, res, next) => {
  // Get program id
  const programId = req.params.programId;
  const { id, state, achieved, version } = req.body;

  // Get user
  let user;
  try {
    user = await User.findById(req.userData.userId);
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      'Cannot update program! Please try again later!',
      500
    );
    return next(error);
  }

  // Find program by programId
  const programData = user.activePrograms.find((pr) => pr.id === id);
  if (!programData) {
    console.log('ID missing in active programs');
    const error = new HttpError("This program isn't active!", 404);
    return next(error);
  }

  // Validate version
  const actualVersion = programData.version.toString();
  const isValid = await validateHash(actualVersion, version);
  if (!isValid) {
    console.log("versions don't match");
    const error = new HttpError(
      'Your data is not up to date! Please reload your page!',
      410
    );
    return next(error);
  }

  // Generate next State for program// Get selected program
  if (!programs.has(id)) {
    console.log('Invalid program id');
    const error = new HttpError('Invalid program id!', 422);
    return next(error);
  }
  const program = programs.get(id);
  const gState = program.getNextState(programData.state, achieved, {
    forceProgress: achieved.forced,
  });

  // Compare passed initState, to generated initState
  const areEqual = eqStates(state, gState);
  if (!areEqual) {
    console.log('Invalid state passed');
    const error = new HttpError('Invalid data!', 422);
    return next(error);
  }

  // Find and update program by programId
  let nextVersion = '';
  user.activePrograms = user.activePrograms.map((pr) => {
    if (pr.id !== programId) {
      return pr;
    }

    nextVersion = nextRand(pr.version.toString());
    return { id, state, version: nextVersion };
  });

  try {
    await user.save();
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      'Cannot update program! Please try again later!',
      500
    );
    return next(error);
  }

  const hashed = await hashValue(nextVersion);

  res.json({ success: true, version: hashed });
};
