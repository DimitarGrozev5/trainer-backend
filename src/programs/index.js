const ees = require('./ees/ees-program');

// Store valid program ids
const validIds = ['ees', 'EnduroGrip'];
exports.validIds = validIds;

// Setup programs map
const programs = new Map();

programs.set('ees', ees);

exports.programs = programs;

// Helper function for comparing states
const isObject = (object) => {
  return object != null && typeof object === 'object';
};

const isDeepEqual = (state1, state2) => {
  const objKeys1 = Object.keys(state1).filter((key) => key !== 'sessionDate');
  const objKeys2 = Object.keys(state2).filter((key) => key !== 'sessionDate');

  if (objKeys1.length !== objKeys2.length) return false;

  for (let key of objKeys1) {
    const value1 = state1[key];
    const value2 = state2[key];

    const isObjects = isObject(value1) && isObject(value2);

    if (
      (isObjects && !isDeepEqual(value1, value2)) ||
      (!isObjects && value1 !== value2)
    ) {
      return false;
    }
  }
  return true;
};

exports.eqStates = isDeepEqual;
