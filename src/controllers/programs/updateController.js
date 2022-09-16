import HttpError from '../../models/HttpError.js';
import User from '../../models/User.js';
import { programs, eqStates } from '../../programs/index.js';
import { hashValue, validateHash } from '../../services/hashService.js';
import { nextRand } from '../../services/randomService.js';

// Update a specific program
export const update = async (req, res, next) => {
  // Get program id
  const programId = req.params.programId;
  const { id, state, achieved, version } = req.body;

  // Get user
  const user = req.userData.User;

  // Find program by programId
  const programData = req.userData.targetProgram;

  // Generate next State for program
  const program = req.userData.targetProgramMethods;

  const tAchieved = await program.transformAchievedData(achieved);
  if (!tAchieved) {
    console.log('Invalid achieved data');
    const error = new HttpError('Invalid achieved data!', 422);
    return next(error);
  }
  const gState = program.getNextState(programData.state, tAchieved);

  // Compare passed State, to generated State
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
