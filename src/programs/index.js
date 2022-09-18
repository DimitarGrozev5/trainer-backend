import ees from './ees/even-easier-strength.js';
import EnduroGrip from './enduro-grip/enduro-grip.js';
import quickDead from './quick-dead/quick-dead.js';

// Store valid program ids
export const validIds = ['ees', 'EnduroGrip', 'quick-dead'];

// Setup programs map
export const programs = new Map();

programs.set('ees', ees);
programs.set('EnduroGrip', EnduroGrip);
programs.set('quick-dead', quickDead);

// Helper function for comparing states
const isObject = (object) => {
  return object != null && typeof object === 'object';
};

export const eqStates = (state1, state2) => {
  const objKeys1 = Object.keys(state1).filter((key) => key !== 'sessionDate');
  const objKeys2 = Object.keys(state2).filter((key) => key !== 'sessionDate');

  if (objKeys1.length !== objKeys2.length) return false;

  for (let key of objKeys1) {
    const value1 = state1[key];
    const value2 = state2[key];

    const isObjects = isObject(value1) && isObject(value2);

    if (
      (isObjects && !eqStates(value1, value2)) ||
      (!isObjects && value1 !== value2)
    ) {
      return false;
    }
  }
  return true;
};
