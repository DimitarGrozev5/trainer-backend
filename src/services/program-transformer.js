import bcrypt from 'bcrypt';
import { getHash } from './hashService';

export const ProgramfromModel = async (id, state, salt) => {
  // Generate sting based on program state
  const hashableData = JSON.stringify({ id, state });

  // Extract only the hash
  const versionHash = await getHash(hashableData, salt);

  return {
    id,
    state,
    version: versionHash,
  };
};
