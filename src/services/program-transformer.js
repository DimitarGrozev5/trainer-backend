import bcrypt from 'bcrypt';

export const ProgramfromModel = async (id, state, salt) => {
  // Generate sting based on program state
  const hashableData = JSON.stringify({ id, state });

  // Get the bcrypt output
  const versionFullHash = await bcrypt.hash(hashableData, salt);

  // Extract only the hash
  const versionHash = versionFullHash.split('$').pop().substring(22);

  return {
    id,
    state,
    version: versionHash,
  };
};
