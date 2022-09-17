import HttpError from '../../models/HttpError.js';

// Delete specific program
export const remove = async (req, res, next) => {
  // Get user
  const user = req.userData.User;

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
