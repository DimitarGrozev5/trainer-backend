import bcrypt from 'bcrypt';

export const getHash = async (value, salt) => {
  const fullHashOutput = await bcrypt.hash(value, salt);
  return fullHashOutput.split('$').pop().substring(22);
};

export const getSalt = async () => bcrypt.genSalt(12);

// TODO: remove
////////vvvvvvvvvv Obsolete
export const hashValue = (val) => {
  return bcrypt.hash(val, 12);
};

export const validateHash = async (val, hash) => {
  // Validate password
  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(val, hash);
  } catch (err) {
    console.log(err);
    return false;
  }

  return isValidPassword;
};
