const HttpError = require('../models/HttpError');
const User = require('../models/User');
const { programs, eqStates } = require('../programs');
const { hashValue } = require('../services/hashService');
const { rand } = require('../services/randomService');
const { validateProgram } = require('../utils/validate-program');

// TODO: If a program is late, change it's sessionDate to today
// Get all programs for user
exports.getAll = async (req, res, next) => {
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

  res.json(user.activePrograms);
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

  return program;
};
exports.get = async (req, res, next) => {
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
exports.add = async (req, res, next) => {
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
exports.remove = async (req, res, next) => {
  // Get program id
  const programId = req.params.programId;

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

  // Find and remove program by programId
  let removedProgram = null;
  user.activePrograms = user.activePrograms.filter((pr) => {
    if (pr.id === programId) {
      removedProgram = { id: pr.id, state: pr.state };
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

  res.json(removedProgram);
};

// Update a specific program
exports.update = async (req, res, next) => {
  // Get program id
  const programId = req.params.programId;

  // Get program update
  const updatedProgram = req.body;

  // Validate program
  const isValid = validateProgram(updatedProgram.id, updatedProgram.state);
  if (!isValid) {
    console.log('Invalid program data');
    const error = new HttpError(
      'Invalid data is send! Please try again later!',
      422
    );
    return next(error);
  }

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

  // Find and update program by programId
  user.activePrograms = user.activePrograms.map((pr) => {
    if (pr.id !== programId) {
      return pr;
    }

    return updatedProgram;
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

  res.json(updatedProgram);
};
