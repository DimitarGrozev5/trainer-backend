const bcrypt = require('bcrypt');

exports.hashValue = (val) => {
  return bcrypt.hash(val, 12);
};

exports.validateHash = async (val, hash) => {
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
