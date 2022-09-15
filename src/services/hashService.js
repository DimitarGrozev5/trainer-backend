import bcrypt from 'bcrypt';

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
