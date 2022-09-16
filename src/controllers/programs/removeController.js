import HttpError from '../../models/HttpError.js';
import User from '../../models/User.js';
import { validateHash } from '../../services/hashService.js';

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
