import User from '../models/User.js';

export const getUser = async (req, res, next) => {
  let user;
  try {
    user = await User.findById(req.userData.userId);
    if (!user) {
      throw 'User not found';
    }
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      'Cannot find user! Please try again later!',
      500
    );
    return next(error);
  }

  req.userData.User = user;

  next();
};
