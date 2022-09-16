import bcrypt from 'bcrypt';

export const fromModel = async (id, state, salt) => {
  const hashableData = JSON.stringify({ id, state });

  const versionFullHash = await bcrypt.hash(hashableData, salt);

  const versionHash = versionFullHash.split('$').pop().substring(22);

  return {
    id,
    state,
    version: versionHash,
  };
};
