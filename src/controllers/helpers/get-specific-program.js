import User from '../../models/User.js';
import { hashValue } from '../../services/hashService.js';

// Get specific program
export const getSpecificProgram = async (userId, programId) => {
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
