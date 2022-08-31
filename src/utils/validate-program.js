const validIds = ["ees", "EnduroGrip"];

exports.validIds = validIds;

exports.validateProgram = (id, state) => {
  if (!validIds.includes(id)) {
    return false;
  }

  if (!("sessionDate" in state)) {
    return false;
  }

  return true;
};
