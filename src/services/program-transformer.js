import { roundDate } from '../utils/date.js';
import { getHash } from './hashService.js';

export const ProgramfromModel = async (id, state, salt) => {
  // Generate sting based on program state
  const hashableData = JSON.stringify({ id, state, salt });

  // Extract only the hash
  const versionHash = await getHash(hashableData, salt);

  let outputState = { ...state };
  if ('sessionDate' in state) {
    const now = roundDate(new Date());

    if (state.sessionDate < now) {
      outputState.sessionDate = now;
    }
  }

  return {
    id,
    state: outputState,
    version: versionHash,
  };
};
