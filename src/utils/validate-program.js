export const validIds = ['ees', 'EnduroGrip'];

export const validateProgram = (id, state) => {
  if (!validIds.includes(id)) {
    return false;
  }

  if (!('sessionDate' in state)) {
    return false;
  }

  return true;
};
