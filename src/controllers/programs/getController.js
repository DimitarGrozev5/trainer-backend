import bcrypt from 'bcrypt';

import HttpError from '../../models/HttpError.js';
import { hashValue } from '../../services/hashService.js';
import { fromModel } from '../../services/program-transformer.js';

export const get = async (req, res, next) => {
  // Get program
  const fullProgram = req.userData.targetProgram;

  if (!fullProgram) {
    console.log('Program not found!');
    const error = new HttpError(
      'The user is not using this program! Please try again later!',
      404
    );
    return next(error);
  }

  const salt = await bcrypt.genSalt(10);

  const ver = await fromModel(fullProgram.id, fullProgram.state, salt);
  console.log(ver);

  // Hash version
  const version = hashValue(fullProgram.version.toString());

  const program = { id: fullProgram.id, state: fullProgram.state, version };

  res.json(program);
};
